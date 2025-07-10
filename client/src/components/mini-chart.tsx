import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MiniChartProps {
  symbol: string;
  className?: string;
}

export default function MiniChart({ symbol, className = "" }: MiniChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  
  const { data: stockData, isLoading } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=1wk`],
    enabled: !!symbol,
    refetchInterval: 15000, // Update every 15 seconds
  });

  useEffect(() => {
    if (stockData?.history && plotRef.current) {
      import('plotly.js-dist').then((Plotly) => {
        const prices = stockData.history.map((d: any) => d.close);
        const dates = stockData.history.map((d: any) => d.date);
        
        const trace = {
          x: dates,
          y: prices,
          type: 'scatter',
          mode: 'lines',
          line: { 
            color: prices[prices.length - 1] > prices[0] ? '#10b981' : '#ef4444', 
            width: 2 
          },
          showlegend: false,
        };

        const layout = {
          margin: { l: 0, r: 0, t: 0, b: 0 },
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: { 
            visible: false,
            showgrid: false,
          },
          yaxis: { 
            visible: false,
            showgrid: false,
          },
          font: { color: 'transparent' },
        };

        const config = {
          responsive: true,
          displayModeBar: false,
          staticPlot: true,
        };

        Plotly.newPlot(plotRef.current!, [trace], layout, config);
      });
    }
  }, [stockData]);

  if (isLoading || !stockData?.history) {
    return (
      <div className={`h-12 bg-muted/20 rounded animate-pulse ${className}`} />
    );
  }

  const currentPrice = stockData.currentPrice || 0;
  const change = stockData.change || 0;
  const changePercent = stockData.changePercent || 0;
  const isPositive = change >= 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="h-12 w-full" ref={plotRef} />
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">${currentPrice.toFixed(2)}</span>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}