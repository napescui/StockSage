import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StockInput from "@/components/stock-input";
import StockOverview from "@/components/stock-overview";
import StockChart from "@/components/stock-chart";
import TechnicalIndicators from "@/components/technical-indicators";
import DataTable from "@/components/data-table";
import AIChat from "@/components/ai-chat";
import { FINANCIAL_INSTRUMENTS } from "@shared/financial-data";

export default function AssetDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const [currentSymbol, setCurrentSymbol] = useState(symbol || 'AAPL');
  const [currentPeriod, setPeriod] = useState('1mo');

  const instrumentInfo = FINANCIAL_INSTRUMENTS.find(inst => inst.symbol === currentSymbol);

  useEffect(() => {
    if (symbol) {
      setCurrentSymbol(symbol);
    }
  }, [symbol]);

  const getCategoryColor = (category: string) => {
    const colors = {
      stocks: 'bg-blue-500',
      indices: 'bg-green-500',
      bonds: 'bg-purple-500',
      crypto: 'bg-orange-500',
      commodities: 'bg-yellow-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      stocks: '📈',
      indices: '📊', 
      bonds: '🏦',
      crypto: '₿',
      commodities: '🥇',
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(instrumentInfo?.category || 'stocks')}</span>
                <h1 className="text-2xl font-bold text-foreground">{currentSymbol}</h1>
              </div>
              {instrumentInfo && (
                <Badge 
                  variant="outline" 
                  className={`text-white ${getCategoryColor(instrumentInfo.category)}`}
                >
                  {instrumentInfo.category.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">
              {instrumentInfo?.name || 'Loading...'}
            </p>
            <p className="text-xs text-muted-foreground">
              {instrumentInfo?.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <StockInput
            onSymbolChange={setCurrentSymbol}
            onPeriodChange={setPeriod}
            currentSymbol={currentSymbol}
            currentPeriod={currentPeriod}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Data */}
          <div className="lg:col-span-2 space-y-6">
            <StockOverview symbol={currentSymbol} period={currentPeriod} />
            <StockChart symbol={currentSymbol} period={currentPeriod} />
            <TechnicalIndicators symbol={currentSymbol} period={currentPeriod} />
            <DataTable symbol={currentSymbol} />
          </div>

          {/* Right Column - AI Chat */}
          <div className="space-y-6">
            <AIChat currentSymbol={currentSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
}