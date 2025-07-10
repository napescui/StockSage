import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface PriceTickerProps {
  symbol: string;
  className?: string;
}

export default function PriceTicker({ symbol, className = "" }: PriceTickerProps) {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  const { convertPrice, formatCurrency } = useCurrency();

  const { data: stockData } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=1h`],
    enabled: !!symbol,
    refetchInterval: 15000, // Update every 15 seconds
  });

  useEffect(() => {
    if (stockData?.currentPrice && previousPrice !== null) {
      if (stockData.currentPrice > previousPrice) {
        setPriceChange('up');
        setIsAnimating(true);
      } else if (stockData.currentPrice < previousPrice) {
        setPriceChange('down');
        setIsAnimating(true);
      } else {
        setPriceChange('neutral');
      }
      
      // Reset animation after 1 second
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
    
    if (stockData?.currentPrice) {
      setPreviousPrice(stockData.currentPrice);
    }
  }, [stockData?.currentPrice, previousPrice]);

  if (!stockData) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-16 h-6 bg-muted/20 rounded animate-pulse" />
        <div className="w-12 h-4 bg-muted/20 rounded animate-pulse" />
      </div>
    );
  }

  const currentPrice = convertPrice(stockData.currentPrice || 0, 'USD');
  const change = convertPrice(stockData.change || 0, 'USD');
  const changePercent = stockData.changePercent || 0;
  const isPositive = change >= 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className={`font-mono text-lg font-bold transition-all duration-300 ${
          isAnimating && priceChange === 'up' ? 'text-green-500 animate-pulse bg-green-500/20 px-2 py-1 rounded' : 
          isAnimating && priceChange === 'down' ? 'text-red-500 animate-pulse bg-red-500/20 px-2 py-1 rounded' : 
          'text-foreground'
        }`}>
          {formatCurrency(currentPrice)}
        </span>
        
        {priceChange === 'up' && (
          <TrendingUp className="w-4 h-4 text-green-500 animate-bounce" />
        )}
        {priceChange === 'down' && (
          <TrendingDown className="w-4 h-4 text-red-500 animate-bounce" />
        )}
        {priceChange === 'neutral' && (
          <Activity className="w-4 h-4 text-gray-500" />
        )}
      </div>
      
      <Badge 
        variant="outline" 
        className={`text-xs ${isPositive ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}`}
      >
        {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
      </Badge>
      
      <span className="text-xs text-muted-foreground">
        10 Juli 2025
      </span>
    </div>
  );
}