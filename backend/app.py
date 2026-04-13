from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'logistic_regression_model.joblib'
SCALER_PATH = 'standard_scaler.joblib'

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

@app.route('/')
def home():
    return {"message": "EV Battery API running"}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        voltage = float(data['voltage'])
        current = float(data['current_percentage'])
        temperature = float(data['temperature'])

        input_data = np.array([[voltage, current, temperature]])
        scaled = scaler.transform(input_data)

        prediction = model.predict(scaled)[0]
        prob = model.predict_proba(scaled)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(prob)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
