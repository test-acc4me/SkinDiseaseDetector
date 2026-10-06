import torch
import torch.nn as nn
from torchvision import models
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent / "model" / "best_skin_disease_model_V2.pth"

_model = None
_class_names = None


def _build_model():
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.35),
        nn.Linear(in_features, 6),
    )
    return model


def get_model():
    global _model, _class_names
    if _model is None:
        checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
        _class_names = checkpoint["class_names"]
        model = _build_model()
        model.load_state_dict(checkpoint["model_state_dict"])
        model.eval()
        _model = model
    return _model, _class_names
