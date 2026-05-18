import { useState, useEffect } from "react";
import { getDailyPerformance } from "../service/AlphaVantageService";
import { supabase } from "../lib/supabase";
import {
  AddStock,
  GetWatchlist,
  RemoveStock,
} from "../service/supabaseWatchlistService";
import "../App.css";

export default function StockList({ userId }) {
  const [symbol, setSymbol] = useState("");
  const [stocks, setStocks] = useState();
  const [error, setError] = useState("");

  async function HandleFetchStocks() {
    const data = await GetWatchlist(supabase, userId);
    setStocks(data);
  }

  async function HandleAddStock(e) {
    e.preventDefault();
    setError("");
    const ticker = symbol.toUpperCase();
    await AddStock(supabase, userId, ticker);
    setSymbol("");
    HandleFetchStocks();
  }

  async function HandleRemoveStock(id, symbol) {
    await RemoveStock(supabase, id, symbol);
    HandleFetchStocks();
  }

  async function HandleCheckPerformance() {
    const updated = await Promise.all(
      stocks.map(async (stock) => ({
        ...stock,
        performance: await getDailyPerformance(stock.symbol),
      })),
    );
    setStocks(updated);
  }

  useEffect(() => {
    if (userId) HandleFetchStocks();
  }, [userId]);

  useEffect(() => {
    if (stocks.length) HandleCheckPerformance();
  }, [stocks.length]);

  return (
    <div>
      <form className="stock-form" onSubmit={HandleAddStock}>
        <input
          type="text"
          placeholder="Enter stock ticker"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />

        <button type="submit">Check</button>
      </form>

      {performance && (
        <p
          style={{
            color: performance > 0 ? "green" : "red",
          }}
        >
          Daily Performance: {performance}%
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
