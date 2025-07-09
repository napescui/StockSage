import { useQuery } from "@tanstack/react-query";
import { Info, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface TechnicalIndicatorsProps {
  symbol: string;
  period: string;
}

export default function TechnicalIndicators({ symbol, period }: TechnicalIndicatorsProps) {
  const { data: stockData, isLoading } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=${period}`],
    enabled: !!symbol,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-surface border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-2 w-full mb-2" />
              <Skeleton className="h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stockData?.indicators) return null;

  const indicators = stockData.indicators;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {/* RSI */}
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">RSI (14)</h4>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono mb-2">
            {indicators.rsi?.toFixed(1)}
          </div>
          <Progress value={indicators.rsi} className="w-full h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {indicators.rsi > 70 ? 'Overbought' : indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
          </p>
        </CardContent>
      </Card>

      {/* MACD */}
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">MACD</h4>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className={`text-2xl font-bold font-mono mb-2 ${indicators.macd >= 0 ? 'text-success' : 'text-error'}`}>
            {indicators.macd >= 0 ? '+' : ''}{indicators.macd?.toFixed(2)}
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className={`w-4 h-4 ${indicators.macd >= 0 ? 'text-success' : 'text-error'}`} />
            <span className={`text-xs ${indicators.macd >= 0 ? 'text-success' : 'text-error'}`}>
              {indicators.macd >= 0 ? 'Bullish' : 'Bearish'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Bollinger Bands */}
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">Bollinger Bands</h4>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Upper:</span>
              <span className="text-xs text-foreground font-mono">
                ${indicators.bollinger?.upper?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Middle:</span>
              <span className="text-xs text-foreground font-mono">
                ${indicators.bollinger?.middle?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Lower:</span>
              <span className="text-xs text-foreground font-mono">
                ${indicators.bollinger?.lower?.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moving Averages */}
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">Moving Average</h4>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">SMA 50:</span>
              <span className="text-xs text-foreground font-mono">
                ${indicators.sma50?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">SMA 200:</span>
              <span className="text-xs text-foreground font-mono">
                ${indicators.sma200?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${indicators.sma50 > indicators.sma200 ? 'text-success' : 'text-error'}`} />
              <span className={`text-xs ${indicators.sma50 > indicators.sma200 ? 'text-success' : 'text-error'}`}>
                {indicators.sma50 > indicators.sma200 ? 'Above MA' : 'Below MA'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
