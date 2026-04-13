from flask import Flask, request, jsonify
import joblib

# Initialize a Flask application instance
app = Flask(__name__)

@app.route('/')
def home():
    return 'Welcome to the EV Battery Thermal Runaway Prediction API!'

# Load the trained model and scaler
try:
    model = joblib.load('logistic_regression_model.joblib')
    scaler = joblib.load('standard_scaler.joblib')
    # Define feature_columns based on the columns used during training
    # These were determined from X_train.columns during the preprocessing phase.
    feature_columns = ['voltage', 'current_percentage', 'temperature']

    print("Model and scaler loaded successfully.")
    print(f"Expected feature columns: {feature_columns}")
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    model = None
    scaler = None
    feature_columns = []

# Create a basic route for the root URL
@app.route('/')
def home():
    return 'Welcome to the EV Battery Thermal Runaway Prediction API!'

# Standard block to run the Flask application in debug mode
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
