import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, TrendingUp, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols: string[];
}

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['/api/news', selectedCategory, sortBy],
  });

  // Mock data for demonstration
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: "Stock Market Hits New Record High as Tech Stocks Surge",
      summary: "The S&P 500 reached a new all-time high today, driven by strong performance in technology stocks. Apple, Microsoft, and NVIDIA led the gains.",
      url: "#",
      publishedAt: "2025-07-10T10:30:00Z",
      source: "Financial Times",
      category: "market",
      sentiment: "positive",
      relatedSymbols: ["AAPL", "MSFT", "NVDA"]
    },
    {
      id: "2",
      title: "Federal Reserve Hints at Potential Interest Rate Changes",
      summary: "In a recent statement, the Federal Reserve indicated possible adjustments to interest rates in the coming months, citing inflation concerns.",
      url: "#",
      publishedAt: "2025-07-10T09:15:00Z",
      source: "Reuters",
      category: "policy",
      sentiment: "neutral",
      relatedSymbols: ["SPY", "QQQ"]
    },
    {
      id: "3",
      title: "Bitcoin Surges Past $100,000 as Institutional Adoption Grows",
      summary: "Bitcoin reached a new milestone as major institutions continue to adopt cryptocurrency, with Tesla and MicroStrategy leading the charge.",
      url: "#",
      publishedAt: "2025-07-10T08:45:00Z",
      source: "CoinDesk",
      category: "crypto",
      sentiment: "positive",
      relatedSymbols: ["BTC-USD", "ETH-USD"]
    },
    {
      id: "4",
      title: "Oil Prices Decline Amid Global Economic Uncertainty",
      summary: "Crude oil prices fell sharply today as concerns about global economic growth weigh on energy markets.",
      url: "#",
      publishedAt: "2025-07-10T07:30:00Z",
      source: "Bloomberg",
      category: "commodities",
      sentiment: "negative",
      relatedSymbols: ["CL=F", "XOM", "CVX"]
    },
    {
      id: "5",
      title: "Tesla Reports Strong Q2 Earnings, Stock Jumps 8%",
      summary: "Tesla exceeded expectations with strong Q2 earnings, reporting record deliveries and improved margins.",
      url: "#",
      publishedAt: "2025-07-10T06:00:00Z",
      source: "CNBC",
      category: "earnings",
      sentiment: "positive",
      relatedSymbols: ["TSLA"]
    }
  ];

  const filteredNews = mockNews.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    return 0;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} jam yang lalu`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} menit yang lalu`;
    } else {
      return 'Baru saja';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">📰 StockAnalyzer News Pro</h1>
              <p className="text-muted-foreground">Berita terbaru pasar modal dan investasi</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="market">Pasar</SelectItem>
              <SelectItem value="policy">Kebijakan</SelectItem>
              <SelectItem value="crypto">Kripto</SelectItem>
              <SelectItem value="commodities">Komoditas</SelectItem>
              <SelectItem value="earnings">Laporan Keuangan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="popular">Terpopuler</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-surface border-border">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            sortedNews.map((item) => (
              <Card key={item.id} className="bg-surface border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">{item.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(item.publishedAt)}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-white ${getSentimentColor(item.sentiment)}`}
                      >
                        {getSentimentIcon(item.sentiment)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Terkait:</span>
                      {item.relatedSymbols.slice(0, 3).map((symbol) => (
                        <Link key={symbol} href={`/asset/${symbol}`}>
                          <Badge variant="secondary" className="text-xs hover:bg-primary/20">
                            {symbol}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && sortedNews.length === 0 && (
          <Card className="bg-surface border-border text-center py-12">
            <CardContent>
              <div className="text-4xl mb-4">📰</div>
              <h3 className="text-lg font-medium mb-2">Tidak ada berita ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter pencarian atau periksa lagi nanti</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}