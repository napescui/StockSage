import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

export const SUPPORTED_CURRENCIES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', rate: 1, symbol: '$' },
  { code: 'IDR', name: 'Indonesian Rupiah', rate: 1, symbol: 'Rp' },
  { code: 'EUR', name: 'Euro', rate: 1, symbol: '€' },
  { code: 'GBP', name: 'British Pound', rate: 1, symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', rate: 1, symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', rate: 1, symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', rate: 1, symbol: '₩' },
  { code: 'SGD', name: 'Singapore Dollar', rate: 1, symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', rate: 1, symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht', rate: 1, symbol: '฿' },
];

export async function fetchExchangeRates(targetCurrency: string = 'USD'): Promise<Record<string, number>> {
  try {
    const pythonScript = `
import yfinance as yf
import json

# Define currency pairs to fetch
currencies = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW', 'SGD', 'MYR', 'THB']
target_currency = '${targetCurrency}'

rates = {}
rates[target_currency] = 1.0

for currency in currencies:
    if currency != target_currency:
        try:
            if target_currency == 'USD':
                # Convert from USD to other currencies
                if currency == 'USD':
                    rates[currency] = 1.0
                else:
                    pair = currency + '=X'
                    ticker = yf.Ticker(pair)
                    info = ticker.info
                    if 'regularMarketPrice' in info:
                        rates[currency] = info['regularMarketPrice']
                    else:
                        # Try alternative format
                        pair = 'USD' + currency + '=X'
                        ticker = yf.Ticker(pair)
                        info = ticker.info
                        if 'regularMarketPrice' in info:
                            rates[currency] = info['regularMarketPrice']
            else:
                # Convert from other currencies to USD, then to target
                if currency == 'USD':
                    # Get rate from target currency to USD
                    if target_currency == 'IDR':
                        pair = 'USDIDR=X'
                    else:
                        pair = target_currency + '=X'
                    ticker = yf.Ticker(pair)
                    info = ticker.info
                    if 'regularMarketPrice' in info:
                        rates[currency] = 1.0 / info['regularMarketPrice']
                else:
                    # Get both rates and calculate cross rate
                    pair1 = currency + '=X' if currency != 'USD' else 'USD=X'
                    pair2 = target_currency + '=X' if target_currency != 'USD' else 'USD=X'
                    
                    ticker1 = yf.Ticker(pair1)
                    ticker2 = yf.Ticker(pair2)
                    
                    info1 = ticker1.info
                    info2 = ticker2.info
                    
                    if 'regularMarketPrice' in info1 and 'regularMarketPrice' in info2:
                        rate1 = info1['regularMarketPrice']
                        rate2 = info2['regularMarketPrice']
                        rates[currency] = rate1 / rate2
        except Exception as e:
            print(f"Error fetching rate for {currency}: {e}")
            # Default fallback rates
            default_rates = {
                'IDR': 15000.0,
                'EUR': 0.85,
                'GBP': 0.75,
                'JPY': 110.0,
                'CNY': 7.0,
                'KRW': 1200.0,
                'SGD': 1.35,
                'MYR': 4.2,
                'THB': 33.0
            }
            if currency in default_rates:
                rates[currency] = default_rates[currency]

print(json.dumps(rates))
`;

    const { stdout } = await execAsync(`python3 -c "${pythonScript}"`);
    const rates = JSON.parse(stdout.trim());
    return rates;
  } catch (error) {
    console.error('Currency fetch error:', error);
    
    // Fallback exchange rates (approximate)
    const fallbackRates: Record<string, number> = {
      'USD': 1.0,
      'IDR': 15000.0,
      'EUR': 0.85,
      'GBP': 0.75,
      'JPY': 110.0,
      'CNY': 7.0,
      'KRW': 1200.0,
      'SGD': 1.35,
      'MYR': 4.2,
      'THB': 33.0
    };

    if (targetCurrency === 'USD') {
      return fallbackRates;
    }

    // Convert all rates to target currency
    const targetRate = fallbackRates[targetCurrency] || 1;
    const convertedRates: Record<string, number> = {};
    
    for (const [currency, rate] of Object.entries(fallbackRates)) {
      if (currency === targetCurrency) {
        convertedRates[currency] = 1.0;
      } else {
        convertedRates[currency] = rate / targetRate;
      }
    }
    
    return convertedRates;
  }
}

export function convertPrice(price: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>): number {
  if (fromCurrency === toCurrency) return price;
  
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdPrice = price / fromRate;
  const convertedPrice = usdPrice * toRate;
  
  return convertedPrice;
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  const symbol = currencyInfo?.symbol || currency;
  
  // Format based on currency
  if (currency === 'IDR') {
    return `${symbol} ${Math.round(amount).toLocaleString('id-ID')}`;
  } else if (currency === 'JPY' || currency === 'KRW') {
    return `${symbol} ${Math.round(amount).toLocaleString()}`;
  } else {
    return `${symbol} ${amount.toFixed(2)}`;
  }
}