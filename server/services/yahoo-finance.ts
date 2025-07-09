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
    
    # Extract key info with proper validation
    current_price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
    market_cap = info.get("marketCap", 0)
    volume = info.get("volume") or info.get("regularMarketVolume") or 0
    pe = info.get("trailingPE") or info.get("forwardPE") or 0
    high52w = info.get("fiftyTwoWeekHigh", 0)
    low52w = info.get("fiftyTwoWeekLow", 0)
    change = info.get("regularMarketChange", 0)
    change_percent = info.get("regularMarketChangePercent", 0)
    
    # Validate if this is a valid stock (has basic info)
    if not current_price and not market_cap and not volume:
        raise Exception(f"Stock symbol {symbol} not found or invalid")
    
    result = {
        "symbol": info.get("symbol", "${symbol}"),
        "name": info.get("longName") or info.get("shortName") or "${symbol}",
        "currentPrice": float(current_price) if current_price else 0,
        "marketCap": int(market_cap) if market_cap else 0,
        "volume": int(volume) if volume else 0,
        "pe": float(pe) if pe and pe != "N/A" else 0,
        "high52w": float(high52w) if high52w else 0,
        "low52w": float(low52w) if low52w else 0,
        "change": float(change) if change else 0,
        "changePercent": float(change_percent) if change_percent else 0,
        "history": history_data,
        "isValid": bool(current_price or market_cap or volume)
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
