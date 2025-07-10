import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CATEGORIES, getInstrumentsByCategory } from "@shared/financial-data";
import LazyCategoryView from "@/components/lazy-category-view";
import FinancialDataGuard from "@/components/financial-data-guard";
import CurrencySelector from "@/components/currency-selector";
import { useCurrency } from "@/contexts/currency-context";

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
          <FinancialDataGuard title="Pasar Keuangan">
            <LazyCategoryView 
              category={selectedCategory} 
              instruments={filteredInstruments} 
            />
          </FinancialDataGuard>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>Powered by Yahoo Finance & Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}