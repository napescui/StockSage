import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CurrencyContextType {
  selectedCurrency: string;
  exchangeRates: Record<string, number>;
  setCurrency: (currency: string) => void;
  convertPrice: (price: number, fromCurrency?: string) => number;
  formatCurrency: (amount: number, currency?: string) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved currency on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Fetch exchange rates when currency changes
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/exchange-rates?base=${selectedCurrency}`);
        const rates = await response.json();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Fallback rates (July 2025 current rates)
        setExchangeRates({
          'USD': 1.0,
          'IDR': 16250.0,   // 1 USD = 16,250 IDR (July 2025)
          'EUR': 0.92,      // 1 USD = 0.92 EUR
          'GBP': 0.79,      // 1 USD = 0.79 GBP
          'JPY': 158.5,     // 1 USD = 158.5 JPY
          'CNY': 7.28,      // 1 USD = 7.28 CNY
          'KRW': 1385.0,    // 1 USD = 1,385 KRW
          'SGD': 1.34,      // 1 USD = 1.34 SGD
          'MYR': 4.68,      // 1 USD = 4.68 MYR
          'THB': 36.2       // 1 USD = 36.2 THB
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [selectedCurrency]);

  const setCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
  };

  const convertPrice = (price: number, fromCurrency: string = 'USD'): number => {
    if (fromCurrency === selectedCurrency) return price;
    
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[selectedCurrency] || 1;
    
    // Convert to USD first, then to target currency
    const usdPrice = price / fromRate;
    const convertedPrice = usdPrice * toRate;
    
    return convertedPrice;
  };

  const formatCurrency = (amount: number, currency: string = selectedCurrency): string => {
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'IDR': 'Rp',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CNY': '¥',
      'KRW': '₩',
      'SGD': 'S$',
      'MYR': 'RM',
      'THB': '฿',
    };
    
    const symbol = currencySymbols[currency] || currency;
    
    // Format based on currency
    if (currency === 'IDR') {
      return `${symbol} ${Math.round(amount).toLocaleString('id-ID')}`;
    } else if (currency === 'JPY' || currency === 'KRW') {
      return `${symbol} ${Math.round(amount).toLocaleString()}`;
    } else {
      return `${symbol} ${amount.toFixed(2)}`;
    }
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    exchangeRates,
    setCurrency,
    convertPrice,
    formatCurrency,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}