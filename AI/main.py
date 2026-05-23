"""
API serve mô hình phát hiện đăng nhập bất thường.

- Đọc model đã được train sẵn từ file `mode_log.joblib`.
- KHÔNG huấn luyện lại trong runtime; service chỉ load model + dự đoán.
- Endpoint:
    GET  /health
    POST /predict   body: { maNguoiDung, ip, time, location, device, threshold? }
"""

import os

import joblib
import pandas as pd
from flask import Flask, jsonify, request

MODEL_PATH = os.environ.get("MODEL_PATH", "mode_log.joblib")
DEFAULT_THRESHOLD = float(os.environ.get("PREDICT_THRESHOLD", "0.6"))

app = Flask(__name__)

# Load model 1 lần khi khởi động để tránh I/O lặp lại trên mỗi request.
_model_bundle = joblib.load(MODEL_PATH)
_model = _model_bundle["model"]
_columns = _model_bundle["columns"]


def _parse_location(value):
    if value is None:
        return None, None
    if isinstance(value, (list, tuple)) and len(value) == 2:
        return value[0], value[1]
    if isinstance(value, str) and "," in value:
        parts = value.split(",")
        if len(parts) >= 2:
            try:
                return float(parts[0].strip()), float(parts[1].strip())
            except ValueError:
                return None, None
    return None, None


def _build_features(record):
    df = pd.DataFrame([record])
    df["time"] = pd.to_datetime(df["time"], errors="coerce")
    df["hour"] = df["time"].dt.hour.fillna(0).astype(int)
    df["weekday"] = df["time"].dt.weekday.fillna(0).astype(int)

    lat, lon = zip(*df["location"].map(_parse_location))
    df["lat"] = pd.to_numeric(pd.Series(lat), errors="coerce").fillna(0.0)
    df["lon"] = pd.to_numeric(pd.Series(lon), errors="coerce").fillna(0.0)

    df["ip"] = df["ip"].fillna("")
    df["device"] = df["device"].fillna("")
    df["maNguoiDung"] = df["maNguoiDung"].fillna("")

    features = df[["ip", "device", "maNguoiDung", "hour", "weekday", "lat", "lon"]]
    features = pd.get_dummies(
        features,
        columns=["ip", "device", "maNguoiDung"],
        drop_first=False,
    )

    for col in _columns:
        if col not in features.columns:
            features[col] = 0

    return features[_columns]


@app.get("/health")
def health():
    return jsonify({"status": "ok", "model": MODEL_PATH})


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    record = {
        "maNguoiDung": payload.get("maNguoiDung"),
        "ip": payload.get("ip"),
        "time": payload.get("time"),
        "location": payload.get("location"),
        "device": payload.get("device"),
    }

    threshold = float(payload.get("threshold", DEFAULT_THRESHOLD))

    features = _build_features(record)
    proba = float(_model.predict_proba(features)[0][1])
    is_trusted = proba >= threshold

    return jsonify({
        "trusted": is_trusted,
        "abnormal": not is_trusted,
        "probability": proba,
        "threshold": threshold,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
