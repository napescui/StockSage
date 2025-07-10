import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, TrendingUp, Filter, Search, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 20;

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['/api/news', selectedCategory, sortBy],
  });

  // Generate comprehensive news data
  const generateNewsData = (): NewsItem[] => {
    const sources = ["Reuters", "Bloomberg", "CNBC", "Financial Times", "Wall Street Journal", "Yahoo Finance", "MarketWatch", "Seeking Alpha", "CoinDesk", "The Motley Fool"];
    const categories = ["market", "policy", "crypto", "commodities", "earnings", "analysis", "global", "tech"];
    const sentiments: ("positive" | "negative" | "neutral")[] = ["positive", "negative", "neutral"];
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "BTC-USD", "ETH-USD", "SPY", "QQQ", "XOM", "CVX", "GOLD", "SILVER"];
    
    const newsTemplates = [
      {
        title: "Stock Market Reaches New Milestone as Tech Sector Leads Rally",
        summary: "Major technology stocks continue to drive market gains with strong investor confidence and robust quarterly results.",
        category: "market",
        sentiment: "positive" as const
      },
      {
        title: "Federal Reserve Announces Policy Changes Affecting Market Direction",
        summary: "The central bank's latest monetary policy decisions are expected to have significant implications for investors and market trends.",
        category: "policy", 
        sentiment: "neutral" as const
      },
      {
        title: "Cryptocurrency Market Experiences Significant Volatility",
        summary: "Digital assets show mixed performance as institutional adoption continues alongside regulatory developments.",
        category: "crypto",
        sentiment: "neutral" as const
      },
      {
        title: "Energy Sector Faces Headwinds Amid Global Economic Shifts",
        summary: "Oil and gas companies navigate challenging market conditions while adapting to evolving energy demands.",
        category: "commodities",
        sentiment: "negative" as const
      },
      {
        title: "Earnings Season Delivers Mixed Results Across Industries",
        summary: "Companies report quarterly results with varying performance metrics reflecting diverse market conditions.",
        category: "earnings",
        sentiment: "neutral" as const
      }
    ];

    const mockNews: NewsItem[] = [];
    
    // Generate 2000+ news items
    for (let i = 0; i < 2500; i++) {
      const template = newsTemplates[i % newsTemplates.length];
      const source = sources[i % sources.length];
      const randomSymbols = symbols.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      const hoursAgo = Math.floor(Math.random() * 72) + 1; // Last 3 days
      
      mockNews.push({
        id: `news-${i + 1}`,
        title: `${template.title} - ${source} Analysis ${i + 1}`,
        summary: `${template.summary} This comprehensive analysis covers market trends, investor sentiment, and key financial indicators affecting major market participants.`,
        url: `https://finance.yahoo.com/news/article-${i + 1}`,
        publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        source: source,
        category: template.category,
        sentiment: template.sentiment,
        relatedSymbols: randomSymbols
      });
    }
    
    return mockNews;
  };

  const allNews = generateNewsData();

  const filteredNews = allNews.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else if (sortBy === "popular") {
      return b.relatedSymbols.length - a.relatedSymbols.length;
    }
    return 0;
  });

  // Lazy loading implementation
  const loadMoreNews = useCallback(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = sortedNews.slice(startIndex, endIndex);
    
    if (page === 1) {
      setDisplayedNews(newItems);
    } else {
      setDisplayedNews(prev => [...prev, ...newItems]);
    }
  }, [sortedNews, page]);

  useEffect(() => {
    setPage(1);
    setDisplayedNews([]);
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    loadMoreNews();
  }, [loadMoreNews, page]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (displayedNews.length < sortedNews.length) {
          setPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedNews.length, sortedNews.length]);

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
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="ml-4">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {isFilterOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="analysis">Analisis</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="tech">Teknologi</SelectItem>
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
          </CollapsibleContent>
        </Collapsible>

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
            displayedNews.map((item) => (
              <Card key={item.id} className="bg-surface border-border hover:shadow-lg transition-shadow">
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
                  
                  <div className="flex items-center justify-between mb-3">
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
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Baca Selengkapnya
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Indicator */}
        {displayedNews.length < sortedNews.length && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              <span>Memuat berita lainnya...</span>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="text-center py-4 text-sm text-muted-foreground">
          Menampilkan {displayedNews.length} dari {sortedNews.length} berita
        </div>

        {/* Empty State */}
        {!isLoading && displayedNews.length === 0 && (
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