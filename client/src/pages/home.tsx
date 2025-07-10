import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { CATEGORIES, getInstrumentsByCategory, type FinancialInstrument } from "@shared/financial-data";
import MiniChart from "@/components/mini-chart";
import FinancialDataGuard from "@/components/financial-data-guard";
import CurrencySelector from "@/components/currency-selector";
import { useCurrency } from "@/contexts/currency-context";

interface CategoryViewProps {
  category: string;
  instruments: FinancialInstrument[];
}

function CategoryView({ category, instruments }: CategoryViewProps) {
  const categoryInfo = CATEGORIES.find(cat => cat.key === category);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-2xl">{categoryInfo?.icon}</span>
          {categoryInfo?.name}
        </h2>
        <Badge variant="outline" className="text-muted-foreground">
          {instruments.length} instrumen
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {instruments.map((instrument) => (
          <Link key={instrument.symbol} href={`/asset/${instrument.symbol}`}>
            <Card className="bg-background border-border hover:bg-accent/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{instrument.symbol}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{instrument.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{instrument.description}</p>
                    </div>
                  </div>
                  <MiniChart symbol={instrument.symbol} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('stocks');
  const [searchTerm, setSearchTerm] = useState('');
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              StockAnalyzer Pro
            </h1>
            <div className="flex-1 flex justify-end">
              <CurrencySelector 
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setCurrency}
              />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Analisis komprehensif untuk saham, indeks, obligasi, kripto, dan komoditas
          </p>
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

        {/* Instruments Grid */}
        <div className="max-w-7xl mx-auto">
          <CategoryView 
            category={selectedCategory} 
            instruments={filteredInstruments} 
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>Powered by Yahoo Finance & Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}