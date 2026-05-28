import os
import json
import numpy as np
import joblib
from django.conf import settings

_models  = {}
_scaler  = None
_encoder = None
_metrics = {}

def _load_all():
    global _scaler, _encoder, _metrics

    folder = str(settings.ML_MODELS_DIR)
    print(f"Loading from: {folder}")

    _scaler  = joblib.load(os.path.join(folder, "scaler.pkl"))
    _encoder = joblib.load(os.path.join(folder, "label_encoder.pkl"))

    with open(os.path.join(folder, "metrics.json")) as f:
        _metrics = json.load(f)

    for name, info in _metrics.items():
        pkl_path = os.path.join(folder, f"{info['slug']}.pkl")
        if os.path.exists(pkl_path):
            _models[info["slug"]] = joblib.load(pkl_path)
            print(f"  Loaded: {name}")
        else:
            print(f"  Skipped (not found): {info['slug']}.pkl")


def _ensure_loaded():
    if not _models:
        print("Loading ML models...")
        _load_all()
        print(f"Done. {len(_models)} models ready.")


FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


def get_metrics():
    _ensure_loaded()
    return _metrics


def get_crops():
    _ensure_loaded()
    return sorted(_encoder.classes_.tolist())


def predict_all(features: dict) -> list:
    _ensure_loaded()

    x_raw    = np.array([[features[k] for k in FEATURES]], dtype=float)
    x_scaled = _scaler.transform(x_raw)

    results = []

    for name, info in _metrics.items():
        slug  = info["slug"]
        model = _models.get(slug)

        if model is None:
            continue

        # ↓ everything from here is INSIDE the for loop
        pred_idx   = int(model.predict(x_scaled)[0])
        pred_label = _encoder.classes_[pred_idx]

        if hasattr(model, "predict_proba"):
            probs      = model.predict_proba(x_scaled)[0]
            top3_idx   = np.argsort(probs)[::-1][:3]
            top3       = [
                {"crop": _encoder.classes_[i], "prob": round(float(probs[i]) * 100, 2)}
                for i in top3_idx
            ]
            confidence = round(float(probs[pred_idx]) * 100, 2)
        else:
            top3       = [{"crop": pred_label, "prob": 100.0}]
            confidence = 100.0

        results.append({
            "name":       name,
            "slug":       slug,
            "prediction": pred_label,
            "confidence": confidence,
            "top3":       top3,
            "accuracy":   info["accuracy"],
            "precision":  info["precision"],
            "recall":     info["recall"],
            "f1":         info["f1"],
            "train_time": info["train_time"],
        })

    results.sort(key=lambda r: r["accuracy"], reverse=True)
    return results