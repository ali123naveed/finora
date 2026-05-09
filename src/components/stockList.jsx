import { useState } from "react";
import { getDailyPerformance } from "../service/AlphaVantageService";

export default function StockList({ userId }) {
  const [symbol, setSymbol] = useState("");
  const [performance, setPerformance] = useState("");
  const [error, setError] = useState("");

  async function HandleAddStock(e) {
    e.preventDefault();
    setError("");
    setPerformance("");

    try {
      const perf = await getDailyPerformance(symbol.toUpperCase());

      if (perf === null) {
        setError("No performance data available for this stock.");
        return;
      }

      setPerformance(perf);
    } catch {
      setError("Failed to fetch stock performance.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Stock Tracker</h1>
        <p style={styles.subHeading}>Track daily stock performance instantly</p>

        <form onSubmit={HandleAddStock} style={styles.form}>
          <input
            type="text"
            placeholder="Enter stock ticker (AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Add Stock
          </button>
        </form>

        {performance && (
          <div
            style={{
              ...styles.resultBox,
              borderColor: performance > 0 ? "#22c55e" : "#ef4444",
            }}
          >
            <p
              style={{
                ...styles.performanceText,
                color: performance > 0 ? "#22c55e" : "#ef4444",
              }}
            >
              Daily Performance: {performance}%
            </p>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #111827 100%)",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
  },

  heading: {
    fontSize: "32px",
    marginBottom: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },

  subHeading: {
    textAlign: "center",
    color: "#cbd5e1",
    marginBottom: "30px",
    fontSize: "15px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "white",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 4px 15px rgba(37,99,235,0.4)",
  },

  resultBox: {
    marginTop: "25px",
    padding: "18px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid",
    textAlign: "center",
  },

  performanceText: {
    fontSize: "22px",
    fontWeight: "bold",
    margin: 0,
  },

  errorBox: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.4)",
  },

  errorText: {
    color: "#f87171",
    textAlign: "center",
    margin: 0,
  },
};
