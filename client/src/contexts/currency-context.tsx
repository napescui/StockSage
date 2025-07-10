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
        // Fallback rates
        setExchangeRates({
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