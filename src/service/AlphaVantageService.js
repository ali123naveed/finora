const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query?";

async function FetchJSON(queryParams) {
  const url = `${BASE_URL}${new URLSearchParams({ ...queryParams, apikey: API_KEY })}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getDailyPerformance(ticker) {
  const json = await FetchJSON({
    function: "TIME_SERIES_DAILY",
    symbol: ticker,
  });
  const timeseries = json["Time Series (Daily)"];
  if (!timeseries) {
    throw new Error(`Unexpected API response: ${JSON.stringify(json)}`);
  }

  const [latestDate, previousDate] = Object.keys(timeseries);

  if (!latestDate || !previousDate) {
    return null;
  }

  const latestClose = parseFloat(timeseries[latestDate]["4. close"]);
  const previousClose = parseFloat(timeseries[previousDate]["4. close"]);

  const performance = ((latestClose / previousClose - 1) * 100).toFixed(2);

  return performance;
}
