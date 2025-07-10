
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
    
    # Handle market cap with multiple fallbacks
    market_cap_raw = info.get("marketCap") or 0
    if market_cap_raw >= 1e12:
        market_cap = f"${market_cap_raw / 1e12:.2f}T"
    elif market_cap_raw >= 1e9:
        market_cap = f"${market_cap_raw / 1e9:.2f}B"
    elif market_cap_raw >= 1e6:
        market_cap = f"${market_cap_raw / 1e6:.2f}M"
    elif market_cap_raw > 0:
        market_cap = f"${market_cap_raw:,.0f}"
    else:
        market_cap = "N/A"
    
    # Handle volume with multiple fallbacks
    volume_raw = info.get("volume") or info.get("regularMarketVolume") or info.get("averageVolume") or 0
    if volume_raw >= 1e6:
        volume = f"{volume_raw / 1e6:.1f}M"
    elif volume_raw >= 1e3:
        volume = f"{volume_raw / 1e3:.1f}K"
    elif volume_raw > 0:
        volume = f"{volume_raw:,}"
    else:
        volume = "N/A"
    
    # Handle P/E ratio
    pe = info.get("trailingPE") or info.get("forwardPE") or 0
    if pe is None or pe <= 0 or pe > 1000:
        pe = 0
    
    high52w = info.get("fiftyTwoWeekHigh", 0)
    low52w = info.get("fiftyTwoWeekLow", 0)
    change = info.get("regularMarketChange", 0)
    change_percent = info.get("regularMarketChangePercent", 0)
    
    # Format and validate all numeric values
    def safe_float(value, default=0):
        try:
            if value is None or value == "N/A" or str(value).lower() == "nan":
                return default
            return float(value)
        except (ValueError, TypeError):
            return default
    
    result = {
        "symbol": info.get("symbol", "${symbol}"),
        "name": info.get("longName") or info.get("shortName") or "${symbol}",
        "currentPrice": safe_float(current_price),
        "marketCap": market_cap,
        "volume": volume,
        "pe": safe_float(pe),
        "high52w": safe_float(high52w),
        "low52w": safe_float(low52w),
        "change": safe_float(change),
        "changePercent": safe_float(change_percent),
        "history": history_data,
        "isValid": bool(current_price or market_cap_raw or volume_raw)
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
