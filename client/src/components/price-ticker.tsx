import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface PriceTickerProps {
  symbol: string;
  className?: string;
}

export default function PriceTicker({ symbol, className = "" }: PriceTickerProps) {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'neutral'>('neutral');

  const { data: stockData } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=1h`],
    enabled: !!symbol,
    refetchInterval: 15000, // Update every 15 seconds
  });

  useEffect(() => {
    if (stockData?.currentPrice && previousPrice !== null) {
      if (stockData.currentPrice > previousPrice) {
        setPriceChange('up');
      } else if (stockData.currentPrice < previousPrice) {
        setPriceChange('down');
      } else {
        setPriceChange('neutral');
      }
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

  const currentPrice = stockData.currentPrice || 0;
  const change = stockData.change || 0;
  const changePercent = stockData.changePercent || 0;
  const isPositive = change >= 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="font-mono text-lg font-bold">
          ${currentPrice.toFixed(2)}
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