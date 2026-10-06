# 🩺 Skin Disease Detector — AI-Powered Skin Analysis

An AI web application that analyzes an uploaded skin image and predicts one of six supported conditions using a fine-tuned **EfficientNet-B0** model (PyTorch). Built as a university final-year project — simple, clean, and presentation-ready.

> ⚠️ **Disclaimer:** This is an AI-based research/educational tool and does **not** provide a medical diagnosis. Results may be inaccurate. Always consult a qualified healthcare professional.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Supported Conditions](#-supported-conditions)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [How It Works](#-how-it-works)
6. [Model Details](#-model-details)
7. [Installation & Running](#-installation--running)
8. [API Endpoints](#-api-endpoints)
9. [Usage Guide](#-usage-guide)
10. [Image Validation Rules](#-image-validation-rules)
11. [Confidence Levels](#-confidence-levels)
12. [Privacy](#-privacy)
13. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- 📤 **Image Upload** — drag & drop or browse (JPG / JPEG / PNG, max 10 MB)
- 📷 **Camera Upload** — on mobile, take a photo directly or pick from the gallery
- 🚫 **Invalid Image Rejection** — non-skin images are refused with a clear message
- 🖼️ **Image Preview** — filename and dimensions shown before analysis
- 🔬 **AI Analysis Animation** — step-by-step "Analyzing image..." progress
- 🎯 **Prediction Result** — predicted condition, confidence %, and HIGH/MODERATE/LOW badge
- 📊 **Probability Breakdown** — animated bars for all six classes
- 📚 **Disease Information** — short, concise educational card per predicted class
- 🧪 **Supported Conditions Section** — clickable cards for all six classes
- 📊 **Model Information** — architecture, framework, dataset sizes, accuracy/F1 stats
- 🌙 **Dark / Light Mode** — toggle in the top-right, saved in the browser
- 📱 **Responsive** — works on desktop, laptop, tablet, and phone
- 🔒 **Privacy Handling** — images are processed in memory and never permanently stored
- 🔄 **Analyze Another Image** — one-click reset

---

## 🦠 Supported Conditions

| # | Condition  |
|---|------------|
| 1 | Chickenpox |
| 2 | Cowpox     |
| 3 | HFMD (Hand, Foot and Mouth Disease) |
| 4 | Healthy    |
| 5 | Measles    |
| 6 | Mpox       |

---

## 🛠️ Tech Stack

| Layer    | Technology |
|----------|------------|
| AI Model | EfficientNet-B0, PyTorch, Torchvision |
| Backend  | FastAPI, Uvicorn, Pillow, python-multipart |
| Frontend | HTML5, CSS3, Vanilla JavaScript (no frameworks) |

---

## 📁 Project Structure

```
SkinDiseaseDetector/
│
├── backend/
│   ├── main.py              # FastAPI app: routes, validation, serving frontend
│   ├── model.py             # EfficientNet-B0 loader (V2 checkpoint)
│   ├── preprocessing.py     # Image transforms (same as V2 evaluation)
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── index.html           # Page structure (hero, result, sections, footer)
│   ├── style.css            # Light/dark themes, responsive layout
│   └── script.js            # Upload, API calls, results, bars, theme toggle
│
├── model/
│   └── best_skin_disease_model_V2.pth   # Trained V2 model weights
│
├── README.md
├── Dockerfile           # One-command container build (Render / HF Spaces)
├── .python-version      # Pins Python 3.11 for deployment
└── .gitignore
```

---

## 🔄 How It Works

```
Upload Image
    ↓
Validation (type / size / format)
    ↓
Preview shown to user
    ↓
Analyze button clicked
    ↓
POST /predict → FastAPI
    ↓
Preprocess: Resize 224×224 → ToTensor → ImageNet Normalize
    ↓
EfficientNet-B0 (V2) inference
    ↓
Softmax → class probabilities
    ↓
JSON response → Result screen (prediction, confidence, breakdown, info)
```

---

## 🤖 Model Details

| Property | Value |
|---|---|
| Architecture | EfficientNet-B0 |
| Classifier head | Dropout(0.35) → Linear(1280 → 6) |
| Framework | PyTorch |
| Input size | 224 × 224 px |
| Classes | 6 |
| Training images | 7,184 |
| Validation images | 896 |
| Internal test images | 903 |
| **Internal test accuracy** | **98.78%** |
| **Internal test macro F1** | **99.06%** |
| External benchmark accuracy | 80.00% (60 images) |

The external benchmark result is intentionally shown for academic transparency.

> **Important:** Website predictions use the **same preprocessing as V2 evaluation** — no training augmentation (no random flips/rotations) is applied.

---

## 🚀 Installation & Running

### 1. Install dependencies
```bash
cd SkinDiseaseDetector\backend
pip install -r requirements.txt
```

### 2. Start the server
```bash
python -m uvicorn main:app
```

### 3. Open the app
Visit: **http://127.0.0.1:8000**

Interactive API docs (for the demo): **http://127.0.0.1:8000/docs**

---

## 🔌 API Endpoints

### `GET /`
Serves the frontend application.

### `GET /health`
```json
{ "status": "ok", "model": "V2" }
```

### `POST /predict`
Send a multipart form-data request with field `file` (the image).

**Success response (200):**
```json
{
  "prediction": "Mpox",
  "confidence": 0.9432,
  "probabilities": {
    "Chickenpox": 0.0231,
    "Cowpox": 0.0142,
    "HFMD": 0.0057,
    "Healthy": 0.0040,
    "Measles": 0.0098,
    "Mpox": 0.9432
  }
}
```

**Error response (400):**
```json
{ "detail": "Please upload a JPG, JPEG, or PNG image." }
```

---

## 📖 Usage Guide

1. Open http://127.0.0.1:8000
2. Drag a skin image into the upload box (or click to browse)
3. Check the preview (filename + dimensions)
4. Click **🔬 Analyze Image**
5. View the prediction, confidence, probability breakdown, and disease info
6. Click **🔄 Analyze Another Image** to test again
7. Use ☀️/🌙 to switch theme, and click any condition card to read about it

---

## ✅ Image Validation Rules

| Rule | Accepted | Rejected |
|---|---|---|
| Format | .jpg, .jpeg, .png | PDF, video, text, other formats |
| Size | ≤ 10 MB | > 10 MB |
| Type | Valid image file | Corrupted or non-image data |

---

## 🎯 Confidence Levels

| Confidence | Label | UI message |
|---|---|---|
| ≥ 80% | HIGH | Model confidence is high. Still not a medical diagnosis. |
| 50–79% | MODERATE | Moderately confident. Consider professional evaluation. |
| < 50% | LOW | Low confidence. Do not rely on this result. |

These are UI labels, not medically validated thresholds.

---

## 🔒 Privacy

- Uploaded images are read into memory, passed through the model, and **never written to disk**.
- No database, no user accounts, no history, no image logging.

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` in `backend/` |
| Port 8000 in use | `python -m uvicorn main:app --port 8001` |
| Model fails to load | Check `model/best_skin_disease_model_V2.pth` exists |
| "Could not reach the server" in the UI | Backend isn't running — start uvicorn first |
| Prediction fails on valid image | Ensure the file is a real JPG/PNG and under 10 MB |

---

## 🌍 Deployment — Go Live for Free

This project is ready to deploy. You need a free account on GitHub and on one hosting platform.

### Step 1 — Push the code to GitHub

```bash
cd SkinDiseaseDetector
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SkinDiseaseDetector.git
git push -u origin main
```

> The model file `best_skin_disease_model_V2.pth` (~48 MB) is under GitHub's 100 MB limit, so it can be committed directly. Do not exceed 100 MB per file.

---

### Option A — Render (recommended, simplest)

[render.com](https://render.com) gives free web services (sleeps after ~15 min idle, wakes on visit).

1. Sign up with your GitHub account.
2. **New → Web Service** → select your `SkinDiseaseDetector` repo.
3. Fill in:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Deploy**. After a few minutes you get a URL like `https://skindiseasedetector.onrender.com`.

That URL works on any phone/laptop anywhere, and the camera feature works because Render serves HTTPS automatically.

---

### Option B — Hugging Face Spaces (free, no credit card, stays awake longer)

1. Sign up at [huggingface.co](https://huggingface.co).
2. **New → Space** → name it, choose **Docker** as the SDK → Create.
3. Upload all project files (including the `Dockerfile` at the repo root).
4. The Space builds automatically and gives you a public URL like `https://huggingface.co/spaces/YOUR_USERNAME/SkinDiseaseDetector`.

The `Dockerfile` in this repo installs CPU-only PyTorch, so the free tier works.

---

### Option C — PythonAnywhere (free, always-on)

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com).
2. Open a **Bash console** and clone your repo.
3. Create a virtualenv, `pip install -r backend/requirements.txt`.
4. In the **Web** tab, add a new web app (manual config, Python 3.11), set the working directory to `backend`, and point the WSGI/ASGI config to run uvicorn — or simpler, use a "always-on" **scheduled task / console** running:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   (On the free tier, web apps use HTTPS on a `yourname.pythonanywhere.com` domain.)

---

### Deployment notes

- **HTTPS:** All these platforms serve HTTPS, which the phone camera feature requires.
- **CPU-only PyTorch:** `backend/requirements.txt` pulls CPU wheels — much smaller and faster to install than the CUDA version.
- **Cold starts:** Render/Spaces may take 20–60 seconds to wake up; that's normal for free tiers.
- **Privacy:** Images are still processed in memory and never stored — true for any deployment of this app.
- **Custom domain (optional):** Render and HF Spaces both allow connecting your own domain for free.

---

## 🎓 Academic Note

This project is intended for educational demonstration. Model performance on real-world, external data (80.00% on 60 benchmark images) shows the gap between internal test metrics and practical deployment — an important discussion point for the presentation.
#   S k i n D i s e a s e D e t e c t o r  
 