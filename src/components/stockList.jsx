import { useState } from "react";
import { getDailyPerformance } from "../service/AlphaVantageService";
import "../App.css";

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
    <div>
      <form className="stock-form" onSubmit={HandleAddStock}>
        <input
          type="text"
          placeholder="Enter stock ticker"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button>check</button>
      </form>
      {performance && (
        <p style={{ color: performance > 0 ? "green" : "red" }}>
          Daily Performance: {performance}%{" "}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
