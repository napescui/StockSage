import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface StockInputProps {
  onSymbolChange: (symbol: string) => void;
  onPeriodChange: (period: string) => void;
  currentSymbol: string;
  currentPeriod: string;
}

export default function StockInput({ onSymbolChange, onPeriodChange, currentSymbol, currentPeriod }: StockInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      onSymbolChange(inputValue.toUpperCase());
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="bg-surface border-border mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="stock-symbol" className="block text-sm font-medium text-muted-foreground mb-2">
              Stock Symbol
            </Label>
            <div className="relative">
              <Input
                id="stock-symbol"
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, GOOGL, TSLA)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Label htmlFor="period" className="block text-sm font-medium text-muted-foreground mb-2">
              Period
            </Label>
            <Select value={currentPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-32 bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1mo">1 Month</SelectItem>
                <SelectItem value="3mo">3 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-shrink-0 flex items-end">
            <Button
              onClick={handleSearch}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 h-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
