import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Newspaper, TrendingUp } from "lucide-react";
import { CATEGORIES, getInstrumentsByCategory } from "@shared/financial-data";
import LazyCategoryView from "@/components/lazy-category-view";
import FinancialDataGuard from "@/components/financial-data-guard";
import CurrencySelector from "@/components/currency-selector";
import MarketFilters, { MarketFilters as MarketFiltersType } from "@/components/market-filters";
import { useCurrency } from "@/contexts/currency-context";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('stocks');
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilters, setMarketFilters] = useState<MarketFiltersType>({
    sortBy: 'marketCap',
    sortOrder: 'desc',
    category: 'all'
  });
  const { selectedCurrency, setCurrency } = useCurrency();

  const filteredInstruments = getInstrumentsByCategory(selectedCategory).filter(instrument =>
    instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrument.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                StockAnalyzer Pro
              </h1>
              <p className="text-muted-foreground text-lg">
                Analisis komprehensif untuk pasar dan berita finansial
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <CurrencySelector 
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setCurrency}
              />
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <Button asChild className="flex items-center gap-2">
              <div>
                <TrendingUp className="w-4 h-4" />
                StockAnalyzer Pro for Market
              </div>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/news">
                <Newspaper className="w-4 h-4" />
                StockAnalyzer News Pro
              </Link>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Cari instrumen keuangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border text-foreground"
            />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key)}
              className="flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <MarketFilters onFilterChange={setMarketFilters} />
          </div>
          
          {/* Instruments Grid */}
          <div className="lg:col-span-3">
            <FinancialDataGuard title="Pasar Keuangan">
              <LazyCategoryView 
                category={selectedCategory} 
                instruments={filteredInstruments} 
              />
            </FinancialDataGuard>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>Powered by Yahoo Finance & Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}