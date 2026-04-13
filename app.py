from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load model and scaler safely
MODEL_PATH = 'logistic_regression_model.joblib'
SCALER_PATH = 'standard_scaler.joblib'

model = None
scaler = None
feature_columns = ['voltage', 'current_percentage', 'temperature']

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model and scaler loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model/scaler: {e}")

# ---------------- ROUTES ---------------- #

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.get_json()

        # Extract inputs
        voltage = float(data['voltage'])
        current = float(data['current_percentage'])
        temperature = float(data['temperature'])

        # Convert to array
        input_data = np.array([[voltage, current, temperature]])

        # Scale input
        scaled_data = scaler.transform(input_data)

        # Predict
        prediction = model.predict(scaled_data)[0]
        probability = model.predict_proba(scaled_data)[0][1]

        return jsonify({
            'prediction': int(prediction),
            'probability': float(probability)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ---------------- RUN ---------------- #

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
