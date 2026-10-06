# 🩺 Skin Disease Detector — AI-Powered Skin Analysis

An AI-powered web application that analyzes an uploaded skin image and predicts one of six supported classes using a fine-tuned **EfficientNet-B0** model built with **PyTorch**.

This project was developed as a university final-year project with a focus on image classification, practical deployment, and responsible AI presentation.

> ⚠️ **Medical Disclaimer**
>
> This application is an AI-based research and educational tool. It does **not** provide a medical diagnosis. Predictions may be incorrect and should not be used as a substitute for professional medical advice. Always consult a qualified healthcare professional.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Supported Conditions](#-supported-conditions)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [How It Works](#-how-it-works)
6. [Model Details](#-model-details)
7. [Model Performance](#-model-performance)
8. [Installation](#-installation)
9. [Running the Application](#-running-the-application)
10. [API Endpoints](#-api-endpoints)
11. [Usage Guide](#-usage-guide)
12. [Image Validation](#-image-validation)
13. [Confidence Levels](#-confidence-levels)
14. [Privacy](#-privacy)
15. [Troubleshooting](#-troubleshooting)
16. [Deployment](#-deployment)
17. [Academic Notes](#-academic-notes)

---

# ✨ Features

- 📤 **Image Upload** — JPG, JPEG, or PNG; maximum 10 MB
- 🖼️ **Image Preview** — filename and dimensions shown before analysis
- 🔬 **AI Analysis** — EfficientNet-B0 V2 through a FastAPI backend
- 🎯 **Prediction Result** — predicted condition and confidence percentage
- 📊 **Probability Breakdown** — probabilities for all six supported classes
- 📚 **Disease Information** — concise educational information for the predicted class
- 🧪 **Supported Conditions** — all six model classes shown in the interface
- 📈 **Model Information** — architecture, dataset size, and evaluation metrics
- 🌙 **Dark / Light Mode**
- 📱 **Responsive Design** — desktop, laptop, tablet, and mobile
- 🔄 **Analyze Another Image**
- 🔒 **Privacy-Oriented Processing** — no accounts, patient profiles, or prediction history

---

# 🦠 Supported Conditions

| # | Condition |
|---|---|
| 1 | Chickenpox |
| 2 | Cowpox |
| 3 | HFMD (Hand, Foot and Mouth Disease) |
| 4 | Healthy |
| 5 | Measles |
| 6 | Mpox |

> **Important:** The model is only trained to classify these six classes. It should not be assumed to detect other skin diseases.

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| AI Model | EfficientNet-B0 |
| Deep Learning | PyTorch |
| Computer Vision | Torchvision |
| Backend | FastAPI |
| ASGI Server | Uvicorn |
| Image Processing | Pillow |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| API | REST / JSON |

---

# 📁 Project Structure

```text
SkinDiseaseDetector/
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── preprocessing.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│
├── model/
│   └── best_skin_disease_model_V2.pth
│
├── README.md
├── Dockerfile
├── .python-version
└── .gitignore
```

---

# 🔄 How It Works

```text
User uploads image
        ↓
File validation
        ↓
Image preview
        ↓
User clicks "Analyze Image"
        ↓
POST /predict
        ↓
FastAPI receives image
        ↓
Resize to 224 × 224
        ↓
ToTensor
        ↓
ImageNet normalization
        ↓
EfficientNet-B0 V2
        ↓
Softmax probabilities
        ↓
Prediction + confidence
        ↓
JSON response
        ↓
Frontend displays results
```

---

# 🤖 Model Details

| Property | Value |
|---|---|
| Architecture | EfficientNet-B0 |
| Classifier | Dropout(0.35) → Linear(1280 → 6) |
| Framework | PyTorch |
| Input Size | 224 × 224 pixels |
| Number of Classes | 6 |
| Training Images | 7,184 |
| Validation Images | 896 |
| Internal Test Images | 903 |
| Model Version | V2 |

### Inference preprocessing

The web application uses the same preprocessing used during V2 evaluation:

```text
Resize → 224 × 224
        ↓
ToTensor
        ↓
ImageNet Normalization
        ↓
EfficientNet-B0
        ↓
Softmax
```

No random training augmentation is used during prediction.

---

# 📊 Model Performance

## Internal Test Set

| Metric | V2 |
|---|---:|
| Accuracy | **98.78%** |
| Macro F1 | **99.06%** |
| Incorrect Predictions | **11 / 903** |

These results are from the held-out V2 internal test dataset.

## External Benchmark

An additional external benchmark containing **60 images** was used to evaluate practical generalization.

| Metric | V2 |
|---|---:|
| Accuracy | **80.00%** |
| Macro F1 | **79.01%** |
| Incorrect Predictions | **12 / 60** |

The external benchmark is a small evaluation set and should **not** be interpreted as clinical validation.

The difference between internal and external performance demonstrates the effect of dataset/domain differences on image classification models.

---

# 🚀 Installation

## 1. Clone or download

```bash
git clone https://github.com/YOUR_USERNAME/SkinDiseaseDetector.git
cd SkinDiseaseDetector
```

Or download the project ZIP and extract it.

## 2. Create a virtual environment

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

## 3. Install dependencies

From the project root:

```powershell
pip install -r backend\requirements.txt
```

---

# ▶️ Running the Application

From the project root:

```powershell
python -m uvicorn backend.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

> If `main.py` is configured to serve the frontend, opening the root URL will display the web application.

---

# 🔌 API Endpoints

## `GET /`

Serves the web application.

## `GET /health`

Example:

```json
{
  "status": "ok",
  "model": "V2"
}
```

## `POST /predict`

Accepts an image using multipart form data with the field `file`.

Example response:

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

---

# 📖 Usage Guide

1. Open `http://127.0.0.1:8000/`.
2. Upload a skin image.
3. Check the image preview.
4. Click **🔬 Analyze Image**.
5. Wait for the AI model to process the image.
6. Review the prediction, confidence, probability breakdown, and educational information.
7. Click **🔄 Analyze Another Image** to perform another prediction.

---

# ✅ Image Validation

| Rule | Accepted | Rejected |
|---|---|---|
| Format | JPG, JPEG, PNG | PDF, video, text, other formats |
| Size | ≤ 10 MB | > 10 MB |
| File | Valid image | Corrupted/invalid image |

> File validation confirms that the uploaded file is a valid image. It does **not** guarantee that the image contains a skin lesion or belongs to one of the supported disease classes.

---

# 🎯 Confidence Levels

| Confidence | Label |
|---|---|
| ≥ 80% | HIGH |
| 50–79% | MODERATE |
| < 50% | LOW |

These are **UI indicators only** and are not medically validated confidence thresholds.

Even a high-confidence prediction should not be interpreted as a medical diagnosis.

---

# 🔒 Privacy

The application is designed without:

- User accounts
- Patient profiles
- Database storage
- Prediction history
- Image history

Uploaded images are processed for inference and are not intended to be permanently stored by the application.

> The exact privacy behavior depends on the deployed backend and hosting configuration.

---

# 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| `ModuleNotFoundError` | Run `pip install -r backend\requirements.txt` |
| Port 8000 is in use | Run `python -m uvicorn backend.main:app --port 8001` |
| Model fails to load | Check `model/best_skin_disease_model_V2.pth` exists |
| Frontend cannot reach backend | Make sure Uvicorn is running |
| Prediction fails | Check that the image is a valid JPG, JPEG, or PNG |
| File too large | Upload an image smaller than 10 MB |

---

# 🌍 Deployment

The application can be deployed to a cloud platform that supports Python/FastAPI applications.

Required runtime:

```text
Python 3.11
FastAPI
Uvicorn
PyTorch
Torchvision
Pillow
```

The trained model must be available at:

```text
model/best_skin_disease_model_V2.pth
```

For production deployment:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

> Free hosting plans, resource limits, and deployment requirements can change. Check the hosting provider's current documentation before deployment.

---

# 🎓 Academic Notes

This project demonstrates:

- Image classification
- Transfer learning
- Deep learning with PyTorch
- EfficientNet-B0
- Dataset preparation
- Class balancing
- Model evaluation
- REST API development
- FastAPI backend development
- Frontend integration
- Responsive web design
- Practical model deployment

The V2 model achieved **98.78% accuracy and 99.06% Macro F1 on the internal held-out test set**.

However, the separate 60-image external benchmark produced **80.00% accuracy**, demonstrating that strong internal test performance does not necessarily translate directly to external real-world images.

This limitation is explicitly acknowledged as part of the project evaluation.

---

# ⚠️ Final Disclaimer

This project is intended for **educational, research, and demonstration purposes only**.

The Skin Disease Detector is not a medical diagnostic system.

Do not use its predictions to:

- Diagnose a medical condition
- Start or stop medication
- Replace professional medical consultation
- Make emergency medical decisions

For medical concerns, consult a qualified healthcare professional.

---

# SkinDiseaseDetector

**AI-powered skin image classification using EfficientNet-B0 and PyTorch.**
