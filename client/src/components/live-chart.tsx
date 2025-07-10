import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw } from "lucide-react";

interface LiveChartProps {
  symbol: string;
  period: string;
  onPeriodChange?: (period: string) => void;
}

const INTERVALS = [
  { label: "15 Detik", value: 15000 },
  { label: "30 Detik", value: 30000 },
  { label: "1 Menit", value: 60000 },
  { label: "5 Menit", value: 300000 },
  { label: "15 Menit", value: 900000 },
  { label: "30 Menit", value: 1800000 },
  { label: "1 Jam", value: 3600000 },
];

export default function LiveChart({ symbol, period, onPeriodChange }: LiveChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(15000); // 15 seconds default
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: stockData, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/stock/${symbol}?period=${period}`],
    enabled: !!symbol,
    refetchInterval: isLive ? updateInterval : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (stockData?.history && plotRef.current) {
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
            title: 'Time',
            gridcolor: '#334155',
            color: '#94a3b8',
            tickfont: { family: 'Roboto Mono', size: 10 }
          },
          yaxis: { 
            title: 'Price ($)',
            gridcolor: '#334155',
            color: '#94a3b8',
            tickfont: { family: 'Roboto Mono', size: 10 }
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
        setLastUpdate(new Date());
      });
    }
  }, [stockData]);

  const handleToggleLive = () => {
    setIsLive(!isLive);
  };

  const handleManualRefresh = () => {
    refetch();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (!symbol) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="h-80 bg-background/50 rounded-lg border border-border flex items-center justify-center">
            <p className="text-muted-foreground">Pilih simbol untuk melihat chart live</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && !stockData) {
    return (
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Live Price Chart</CardTitle>
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
            <p className="text-red-500">Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-foreground">Live Price Chart</CardTitle>
            <Badge variant={isLive ? "default" : "secondary"} className="text-xs">
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Period Controls */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPeriodChange?.('1h')}
                className={period === '1h' ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-primary"}
              >
                1H
              </Button>
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

            {/* Update Interval */}
            <Select value={updateInterval.toString()} onValueChange={(value) => setUpdateInterval(parseInt(value))}>
              <SelectTrigger className="w-32 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVALS.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value.toString()}>
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Live Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleLive}
              className={`${isLive ? 'text-green-500 border-green-500' : 'text-muted-foreground'}`}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="text-muted-foreground hover:text-primary"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Status Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>
            Update terakhir: {formatTime(lastUpdate)}
          </span>
          <span>
            Update setiap: {INTERVALS.find(i => i.value === updateInterval)?.label}
          </span>
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