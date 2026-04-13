import { useState } from "react";
import axios from "axios";

const API_URL = "https://truthful-purpose-production-5543.up.railway.app/predict";

export default function App() {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [temperature, setTemperature] = useState("");
  const [result, setResult] = useState(null);
  const [prob, setProb] = useState(null);

  const predict = async () => {
    try {
      const res = await axios.post(API_URL, {
        voltage: Number(voltage),
        current_percentage: Number(current),
        temperature: Number(temperature),
      });

      setResult(res.data.prediction);
      setProb(res.data.probability || 0);
    } catch (err) {
      alert("API Error ❌");
    }
  };

  const getStatus = () => {
    if (result === null) return "";
    if (result === 0) return "SAFE";
    if (prob < 0.7) return "WARNING";
    return "DANGER";
  };

  const getColor = () => {
    if (result === 0) return "#22c55e";
    if (prob < 0.7) return "#facc15";
    return "#ef4444";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* EV IMAGE */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
          alt="EV"
          style={styles.image}
        />

        <h1 style={styles.title}>EV Battery Monitor</h1>

        <input
          placeholder="Voltage (V)"
          value={voltage}
          onChange={(e) => setVoltage(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Current (%)"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Temperature (°C)"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          style={styles.input}
        />

        <button onClick={predict} style={styles.button}>
          Predict
        </button>

        {result !== null && (
          <div style={styles.resultContainer}>
            <h2 style={{ color: getColor() }}>{getStatus()}</h2>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(prob * 100).toFixed(0)}%`,
                  background: getColor(),
                }}
              />
            </div>

            <p style={{ color: "#ccc" }}>
              Risk Probability: {(prob * 100).toFixed(2)}%
            </p>
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
    background:
      "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
    fontFamily: "Segoe UI",
  },

  card: {
    backdropFilter: "blur(20px)",
    background: "rgba(30, 41, 59, 0.7)",
    padding: "30px",
    borderRadius: "20px",
    width: "340px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  },

  image: {
    width: "70px",
    marginBottom: "10px",
  },

  title: {
    color: "#fff",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#0f172a",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  resultContainer: {
    marginTop: "20px",
  },

  progressBar: {
    width: "100%",
    height: "10px",
    background: "#1e293b",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    transition: "0.5s",
  },
};
