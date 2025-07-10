import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface StockChartProps {
  symbol: string;
  period: string;
  onPeriodChange?: (period: string) => void;
}

export default function StockChart({ symbol, period, onPeriodChange }: StockChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=${period}`],
    enabled: !!symbol,
  });

  useEffect(() => {
    if (stockData?.history && plotRef.current) {
      // Dynamically import Plotly to avoid SSR issues
      import('plotly.js-dist').then((Plotly) => {
        const trace = {
          x: stockData.history.map((d: any) => d.date),
          y: stockData.history.map((d: any) => d.close),
          type: 'scatter',
          mode: 'lines',
          line: { color: '#00D4AA', width: 2 },
          fill: 'tonexty',
          fillcolor: 'rgba(0, 212, 170, 0.1)',
          name: 'Price',
        };

        const layout = {
          title: '',
          xaxis: { 
            title: 'Date',
            gridcolor: '#334155',
            color: '#94a3b8',
            tickfont: { family: 'Roboto Mono' }
          },
          yaxis: { 
            title: 'Price ($)',
            gridcolor: '#334155',
            color: '#94a3b8',
            tickfont: { family: 'Roboto Mono' }
          },
          plot_bgcolor: '#0f172a',
          paper_bgcolor: '#0f172a',
          font: { color: '#f8fafc' },
          margin: { l: 50, r: 50, t: 30, b: 50 },
        };

        const config = {
          responsive: true,
          displayModeBar: false,
        };

        Plotly.newPlot(plotRef.current!, [trace], layout, config);
      });
    }
  }, [stockData]);

  if (!symbol) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="h-80 bg-background/50 rounded-lg border border-border flex items-center justify-center">
            <p className="text-muted-foreground">Enter a stock symbol to view chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Price Chart</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 bg-background/50 rounded-lg border border-border flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="h-80 bg-background/50 rounded-lg border border-border flex items-center justify-center">
            <p className="text-error">Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Price Chart</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPeriodChange?.('1d')}
              className={period === '1d' ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-primary"}
            >
              1D
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPeriodChange?.('1wk')}
              className={period === '1wk' ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-primary"}
            >
              1W
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPeriodChange?.('1mo')}
              className={period === '1mo' ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-primary"}
            >
              1M
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPeriodChange?.('1y')}
              className={period === '1y' ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-primary"}
            >
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80 chart-container">
          <div ref={plotRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}
