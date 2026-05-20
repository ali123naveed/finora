import { useState, useEffect } from "react";
import { getDailyPerformance } from "../service/AlphaVantageService";
import { supabase } from "../lib/supabase";
import {
  AddStock,
  FetchWatchlist,
  RemoveStock,
} from "../service/supabaseWatchlistService";
import "../App.css";

export default function StockList({ userId }) {
  const [symbol, setSymbol] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch watchlist
  async function HandleFetchStocks() {
    try {
      setLoading(true);

      const data = await FetchWatchlist(supabase, userId);

      if (data) {
        setStocks(data);
      } else {
        setStocks([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch watchlist");
    } finally {
      setLoading(false);
    }
  }

  // Add stock
  async function HandleAddStock(e) {
    e.preventDefault();

    try {
      setError("");

      if (!symbol.trim()) {
        setError("Please enter a stock ticker");
        return;
      }

      const ticker = symbol.toUpperCase().trim();

      // Prevent duplicates
      const alreadyExists = stocks.some((stock) => stock.symbol === ticker);

      if (alreadyExists) {
        setError("Stock already exists");
        return;
      }

      await AddStock(supabase, userId, ticker);

      setSymbol("");

      await HandleFetchStocks();
    } catch (err) {
      console.error(err);
      setError("Failed to add stock");
    }
  }

  async function HandleRemoveStock(id, symbol) {
    try {
      await RemoveStock(supabase, id, symbol);

      await HandleFetchStocks();
    } catch (err) {
      console.error(err);
      setError("Failed to remove stock");
    }
  }

  async function HandleCheckPerformance() {
    try {
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          const performance = await getDailyPerformance(stock.symbol);

          return {
            ...stock,
            performance,
          };
        }),
      );

      setStocks(updatedStocks);
    } catch {
      setError("Failed to fetch stock performance");
    }
  }

  // Load watchlist
  useEffect(() => {
    if (userId) {
      HandleFetchStocks();
    }
  }, [userId]);

  // Load performance
  useEffect(() => {
    if (stocks.length > 0 && stocks[0].performance === undefined) {
      HandleCheckPerformance();
    }
  }, [stocks]);

  return (
    <div>
      <form className="stock-form" onSubmit={HandleAddStock}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="AAPL"
        />
        <button>+</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="stock-list">
        {stocks.map((stock) => {
          const perfNum = parseFloat(stock.perf);
          const perfColor = isNaN(perfNum)
            ? "black"
            : perfNum >= 0
              ? "green"
              : "red";
          return (
            <li key={stock.id}>
              <span>
                <strong>{stock.symbol}</strong>{" "}
                <span style={{ color: perfColor }}>
                  {stock.perf ? `${stock.perf}%` : "…"}
                </span>
              </span>
              <button
                className="remove-btn"
                onClick={() => HandleRemoveStock(stock.id)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
