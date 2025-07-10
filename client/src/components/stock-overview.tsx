import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Building2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@shared/financial-data";
import { useCurrency } from "@/contexts/currency-context";

interface StockOverviewProps {
  symbol: string;
  period: string;
}

export default function StockOverview({ symbol, period }: StockOverviewProps) {
  const { convertPrice, formatCurrency } = useCurrency();
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=${period}`],
    enabled: !!symbol,
  });

  // Track price changes for animation
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

  if (isLoading) {
    return (
      <Card className="bg-surface border-border mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-background/50 rounded-lg p-4 border border-border">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border mb-6">
        <CardContent className="p-6">
          <div className="text-center text-error">
            Error loading stock data. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stockData) return null;

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? "text-success" : "text-error";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // Detect asset type based on symbol
  const isStock = !symbol.includes('-USD') && !symbol.includes('=F') && !symbol.includes('^');
  const isCrypto = symbol.includes('-USD');
  const isFuture = symbol.includes('=F');
  const isIndex = symbol.includes('^');

  return (
    <Card className="bg-surface border-border mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Building2 className="text-primary text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{stockData.name}</h2>
              <p className="text-muted-foreground font-mono">{stockData.symbol}</p>
            </div>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className={`text-3xl font-bold font-mono transition-colors duration-200 ${
              isAnimating && priceChange === 'up' ? 'text-green-500' : 
              isAnimating && priceChange === 'down' ? 'text-red-500' : 
              'text-foreground'
            }`}>
              {formatCurrency(convertPrice(stockData.currentPrice, 'USD'))}
            </div>
            <div className={`flex items-center space-x-2 ${changeColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="font-mono">
                {isPositive ? '+' : ''}
                {formatCurrency(convertPrice(stockData.change, 'USD'))} ({formatPrice(stockData.changePercent)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-muted-foreground text-sm mb-1">Market Cap</p>
            <p className="font-mono font-semibold text-foreground">{stockData.marketCap}</p>
          </div>
          {/* Show Volume for stocks and crypto */}
          {(isStock || isCrypto) && (
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <p className="text-muted-foreground text-sm mb-1">Volume</p>
              <p className="font-mono font-semibold text-foreground">{stockData.volume}</p>
            </div>
          )}

          {/* Show P/E Ratio only for stocks */}
          {isStock && (
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <p className="text-muted-foreground text-sm mb-1">P/E Ratio</p>
              <p className="font-mono font-semibold text-foreground">{stockData.pe?.toFixed(2) || 'N/A'}</p>
            </div>
          )}

          {/* Show alternative metrics for non-stocks */}
          {isFuture && (
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <p className="text-muted-foreground text-sm mb-1">Contract Value</p>
              <p className="font-mono font-semibold text-foreground">
                ${stockData.currentPrice?.toFixed(2) || 'N/A'}
              </p>
            </div>
          )}

          {isIndex && (
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <p className="text-muted-foreground text-sm mb-1">Index Points</p>
              <p className="font-mono font-semibold text-foreground">
                {stockData.currentPrice?.toFixed(2) || 'N/A'}
              </p>
            </div>
          )}
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-muted-foreground text-sm mb-1">52W High</p>
            <p className="font-mono font-semibold text-foreground">${stockData.high52w?.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}