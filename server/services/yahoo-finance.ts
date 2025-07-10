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
    
    # Handle different periods and intervals for better real-time data
    if "${period}" == "1h":
        hist = ticker.history(period="1d", interval="1m")  # 1-minute intervals for 1 hour view
        date_format = "%Y-%m-%d %H:%M:%S"
    elif "${period}" == "1d":
        hist = ticker.history(period="1d", interval="2m")  # 2-minute intervals for 1 day
        date_format = "%Y-%m-%d %H:%M:%S"
    elif "${period}" == "1wk":
        hist = ticker.history(period="1wk", interval="15m")  # 15-minute intervals for 1 week
        date_format = "%Y-%m-%d %H:%M"
    elif "${period}" == "1mo":
        hist = ticker.history(period="1mo", interval="1h")  # 1-hour intervals for 1 month
        date_format = "%Y-%m-%d %H:%M"
    elif "${period}" == "1y":
        hist = ticker.history(period="1y", interval="1d")
        date_format = "%Y-%m-%d"
    else:
        hist = ticker.history(period="${period}", interval="1m")
        date_format = "%Y-%m-%d %H:%M:%S"
    
    info = ticker.info

    # Convert history to JSON-serializable format
    history_data = []
    for date, row in hist.iterrows():
        history_data.append({
            "date": date.strftime(date_format),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row["Volume"])
        })

    # Extract key info
    current_price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
    market_cap = info.get("marketCap") or 0
    volume = info.get("volume") or info.get("regularMarketVolume") or 0
    pe = info.get("trailingPE") or info.get("forwardPE") or 0
    high52w = info.get("fiftyTwoWeekHigh", 0)
    low52w = info.get("fiftyTwoWeekLow", 0)
    change = info.get("regularMarketChange", 0)
    change_percent = info.get("regularMarketChangePercent", 0)

    # Format market cap
    if market_cap >= 1e12:
        market_cap_formatted = f"{market_cap / 1e12:.2f}T"
    elif market_cap >= 1e9:
        market_cap_formatted = f"{market_cap / 1e9:.2f}B"
    elif market_cap >= 1e6:
        market_cap_formatted = f"{market_cap / 1e6:.2f}M"
    else:
        market_cap_formatted = str(market_cap)

    # Format volume
    if volume >= 1e6:
        volume_formatted = f"{volume / 1e6:.1f}M"
    elif volume >= 1e3:
        volume_formatted = f"{volume / 1e3:.1f}K"
    else:
        volume_formatted = str(volume)

    result = {
        "symbol": info.get("symbol", "${symbol}"),
        "name": info.get("longName") or info.get("shortName") or "${symbol}",
        "currentPrice": current_price,
        "marketCap": market_cap_formatted,
        "volume": volume_formatted,
        "pe": pe,
        "high52w": high52w,
        "low52w": low52w,
        "change": change,
        "changePercent": change_percent,
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

export async function suggestSimilarStocks(symbol: string): Promise<string[]> {
  const commonStocks = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA', 'AMD', 'INTC',
    'BABA', 'DIS', 'UBER', 'LYFT', 'SNAP', 'TWTR', 'COIN', 'PLTR', 'ROKU', 'SQ',
    'PYPL', 'ADBE', 'CRM', 'ORCL', 'IBM', 'CSCO', 'QCOM', 'AVGO', 'TXN', 'AMAT',
    'SPY', 'QQQ', 'VTI', 'IWM', 'EEM', 'GLD', 'SLV', 'USO', 'TLT', 'HYG'
  ];

  const suggestions = commonStocks.filter(stock => 
    stock.toLowerCase().includes(symbol.toLowerCase()) || 
    symbol.toLowerCase().includes(stock.toLowerCase())
  );

  return suggestions.slice(0, 5);
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

export async function formatMarketCap(marketCap: string | number): Promise<string> {
  if (typeof marketCap === 'string') {
    return marketCap;
  }
  
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
}

export async function formatVolume(volume: string | number): Promise<string> {
  if (typeof volume === 'string') {
    return volume;
  }
  
  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  } else {
    return volume.toLocaleString();
  }
}