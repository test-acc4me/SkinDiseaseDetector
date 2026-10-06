import io
import torch
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from PIL import Image, UnidentifiedImageError
from pathlib import Path

from model import get_model
from preprocessing import preprocess

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_MIME = {"image/jpeg", "image/png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

app = FastAPI(title="Skin Disease Detector API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "model": "V2"}


def is_likely_skin_image(image: Image.Image, min_ratio: float = 0.08) -> bool:
    """Heuristic check: at least `min_ratio` of pixels should have skin-like RGB values."""
    img = image.convert("RGB").resize((224, 224))
    arr = np.asarray(img).astype(np.int16)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    skin = (
        (r > 95) & (g > 40) & (b > 20)
        & ((np.maximum.reduce([r, g, b]) - np.minimum.reduce([r, g, b])) > 15)
        & (np.abs(r - g) > 15)
        & (r > g) & (r > b)
    )
    return float(skin.mean()) >= min_ratio


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS or (file.content_type and file.content_type not in ALLOWED_MIME):
        raise HTTPException(status_code=400, detail="Please upload a JPG, JPEG, or PNG image.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File is too large. Maximum size is 10 MB.")

    try:
        image = Image.open(io.BytesIO(contents))
        image.verify()
        image = Image.open(io.BytesIO(contents))
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    if not is_likely_skin_image(image):
        raise HTTPException(status_code=400, detail="Invalid image: this does not appear to be a skin image.")

    model, class_names = get_model()
    tensor = preprocess(image)
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs, dim=1)[0]

    prob_dict = {name: round(float(p), 4) for name, p in zip(class_names, probs)}
    best_idx = int(torch.argmax(probs))
    return {
        "prediction": class_names[best_idx],
        "confidence": round(float(probs[best_idx]), 4),
        "probabilities": prob_dict,
    }


# Serve frontend
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


@app.get("/")
def index():
    return FileResponse(FRONTEND_DIR / "index.html")
