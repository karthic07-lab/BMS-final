import { useState } from "react";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({
    voltage: "",
    current_percentage: "",
    temperature: ""
  });

  const [result, setResult] = useState(null);

  const API_URL = "https://diplomatic-magic-production.up.railway.app/predict";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predict = async () => {
    try {
      const res = await axios.post(API_URL, form);
      setResult(res.data);
    } catch (err) {
      setResult({ error: "API error" });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>EV Battery Predictor</h2>

        <input name="voltage" placeholder="Voltage" onChange={handleChange} />
        <input name="current_percentage" placeholder="Current %" onChange={handleChange} />
        <input name="temperature" placeholder="Temperature" onChange={handleChange} />

        <button onClick={predict}>Predict</button>

        {result && (
          <div>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <>
                <p>Prediction: {result.prediction}</p>
                <p>Probability: {result.probability.toFixed(2)}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white"
  },
  card: {
    padding: "30px",
    background: "#1e293b",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
};
