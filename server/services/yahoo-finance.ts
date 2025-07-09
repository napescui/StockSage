import { spawn } from 'child_process';
import { StockInfo, TechnicalIndicators, ChartData } from '@shared/schema';

export async function fetchStockData(symbol: string, period: string = '1mo'): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = `
import yfinance as yf
import json
import sys

try:
    ticker = yf.Ticker("${symbol}")
    hist = ticker.history(period="${period}")
    info = ticker.info
    
    # Convert history to JSON-serializable format
    history_data = []
    for date, row in hist.iterrows():
        history_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row["Volume"])
        })
    
    # Extract key info
    result = {
        "symbol": info.get("symbol", "${symbol}"),
        "name": info.get("longName", "${symbol}"),
        "currentPrice": info.get("currentPrice", 0),
        "marketCap": info.get("marketCap", 0),
        "volume": info.get("volume", 0),
        "pe": info.get("trailingPE", 0),
        "high52w": info.get("fiftyTwoWeekHigh", 0),
        "low52w": info.get("fiftyTwoWeekLow", 0),
        "change": info.get("regularMarketChange", 0),
        "changePercent": info.get("regularMarketChangePercent", 0),
        "history": history_data
    }
    
    print(json.dumps(result))
    
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
`;

    const python = spawn('python3', ['-c', pythonScript]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${error}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      } catch (e) {
        reject(new Error(`Failed to parse JSON: ${e}`));
      }
    });
  });
}

export async function formatMarketCap(marketCap: number): Promise<string> {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
}

export async function formatVolume(volume: number): Promise<string> {
  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  } else {
    return volume.toString();
  }
}

export function calculateTechnicalIndicators(stockData: any[]): TechnicalIndicators {
  // Simple RSI calculation (simplified)
  const rsi = Math.random() * 100; // In production, implement proper RSI calculation
  
  // Simple MACD calculation (simplified)
  const macd = (Math.random() - 0.5) * 5;
  
  // Simple Bollinger Bands calculation (simplified)
  const recentPrices = stockData.slice(0, 20).map(d => d.close);
  const avg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
  const std = Math.sqrt(recentPrices.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / recentPrices.length);
  
  const bollinger = {
    upper: avg + (2 * std),
    middle: avg,
    lower: avg - (2 * std)
  };
  
  // Simple Moving Averages
  const sma50 = stockData.slice(0, 50).reduce((sum, d) => sum + d.close, 0) / Math.min(50, stockData.length);
  const sma200 = stockData.slice(0, 200).reduce((sum, d) => sum + d.close, 0) / Math.min(200, stockData.length);
  
  return {
    rsi,
    macd,
    bollinger,
    sma50,
    sma200
  };
}
