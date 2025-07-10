import { useState } from "react";
import { Helmet } from "react-helmet";
import { ChartLine, Bell, User } from "lucide-react";
import StockInput from "@/components/stock-input";
import StockOverview from "@/components/stock-overview";
import StockChart from "@/components/stock-chart";
import AIChat from "@/components/ai-chat";
import DataTable from "@/components/data-table";
import TechnicalIndicators from "@/components/technical-indicators";

export default function Dashboard() {
  const [currentSymbol, setCurrentSymbol] = useState<string>("");
  const [period, setPeriod] = useState<string>("1mo");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>StockAnalyzer Pro - Professional Stock Analysis Dashboard</title>
        <meta name="description" content="Professional stock analysis platform with Yahoo Finance integration, interactive charts, and AI-powered insights. Get comprehensive financial data and analysis for your investment decisions." />
      </Helmet>

      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ChartLine className="text-primary-foreground text-sm" />
            </div>
            <h1 className="text-xl font-bold text-primary">StockAnalyzer Pro</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Watchlist</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Settings</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stock Input */}
        <StockInput 
          onSymbolChange={setCurrentSymbol}
          onPeriodChange={setPeriod}
          currentSymbol={currentSymbol}
          currentPeriod={period}
        />

        {/* Stock Overview */}
        {currentSymbol && (
          <StockOverview symbol={currentSymbol} period={period} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <StockChart symbol={currentSymbol} period={period} onPeriodChange={setPeriod} />
          </div>

          {/* AI Chat */}
          <div className="lg:col-span-1">
            <AIChat currentSymbol={currentSymbol} />
          </div>
        </div>

        {/* Data Table */}
        {currentSymbol && (
          <DataTable symbol={currentSymbol} />
        )}

        {/* Technical Indicators */}
        {currentSymbol && (
          <TechnicalIndicators symbol={currentSymbol} period={period} />
        )}
      </div>
    </div>
  );
}
