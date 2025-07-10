import { useState } from "react";
import { Filter, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MarketFiltersProps {
  onFilterChange: (filters: MarketFilters) => void;
}

export interface MarketFilters {
  sortBy: 'marketCap' | 'volume' | 'priceChange' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
  category: string;
  minMarketCap?: number;
  maxMarketCap?: number;
}

export default function MarketFilters({ onFilterChange }: MarketFiltersProps) {
  const [filters, setFilters] = useState<MarketFilters>({
    sortBy: 'marketCap',
    sortOrder: 'desc',
    category: 'all'
  });

  const handleFilterChange = (key: keyof MarketFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const quickFilters = [
    { 
      label: 'Market Cap Terbesar', 
      icon: <TrendingUp className="w-4 h-4" />, 
      action: () => handleFilterChange('sortBy', 'marketCap')
    },
    { 
      label: 'Volume Tertinggi', 
      icon: <Activity className="w-4 h-4" />, 
      action: () => handleFilterChange('sortBy', 'volume')
    },
    { 
      label: 'Gainer Terbesar', 
      icon: <TrendingUp className="w-4 h-4" />, 
      action: () => {
        handleFilterChange('sortBy', 'priceChange');
        handleFilterChange('sortOrder', 'desc');
      }
    },
    { 
      label: 'Loser Terbesar', 
      icon: <TrendingDown className="w-4 h-4" />, 
      action: () => {
        handleFilterChange('sortBy', 'priceChange');
        handleFilterChange('sortOrder', 'asc');
      }
    }
  ];

  const marketCapRanges = [
    { label: 'Semua', value: 'all' },
    { label: 'Large Cap (>$10B)', value: 'large', min: 10000000000 },
    { label: 'Mid Cap ($2B-$10B)', value: 'mid', min: 2000000000, max: 10000000000 },
    { label: 'Small Cap (<$2B)', value: 'small', max: 2000000000 },
  ];

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter Pasar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Filters */}
        <div>
          <h3 className="text-sm font-medium mb-3">Filter Cepat</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={filter.action}
              >
                {filter.icon}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Urutkan Berdasarkan</label>
            <Select value={filters.sortBy} onValueChange={(value: any) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketCap">Market Cap</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="priceChange">Perubahan Harga</SelectItem>
                <SelectItem value="alphabetical">Alfabetis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Urutan</label>
            <Select value={filters.sortOrder} onValueChange={(value: any) => handleFilterChange('sortOrder', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Tertinggi ke Terendah</SelectItem>
                <SelectItem value="asc">Terendah ke Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Market Cap Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rentang Market Cap</label>
          <Select 
            value={filters.minMarketCap?.toString() || 'all'} 
            onValueChange={(value) => {
              const range = marketCapRanges.find(r => r.value === value);
              if (range) {
                handleFilterChange('minMarketCap', range.min);
                handleFilterChange('maxMarketCap', range.max);
              } else {
                handleFilterChange('minMarketCap', undefined);
                handleFilterChange('maxMarketCap', undefined);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {marketCapRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        <div>
          <h3 className="text-sm font-medium mb-2">Filter Aktif</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {filters.sortBy === 'marketCap' && 'Market Cap'}
              {filters.sortBy === 'volume' && 'Volume'}
              {filters.sortBy === 'priceChange' && 'Perubahan Harga'}
              {filters.sortBy === 'alphabetical' && 'Alfabetis'}
            </Badge>
            <Badge variant="secondary">
              {filters.sortOrder === 'desc' ? 'Tertinggi' : 'Terendah'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}