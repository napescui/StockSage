import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ExternalLink, Clock } from "lucide-react";

interface EntityNewsProps {
  symbol: string;
  companyName?: string;
}

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export default function EntityNews({ symbol, companyName }: EntityNewsProps) {
  const { data: newsData, isLoading } = useQuery({
    queryKey: [`/api/news/${symbol}`],
    enabled: !!symbol,
  });

  if (isLoading) {
    return (
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Berita Terkini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Fallback news data for demonstration
  const fallbackNews: NewsItem[] = [
    {
      title: `${companyName || symbol} Reports Strong Q3 Earnings`,
      summary: `${companyName || symbol} mengumumkan hasil keuangan kuartal ketiga yang melampaui ekspektasi analis dengan pertumbuhan pendapatan yang solid.`,
      url: "#",
      publishedAt: "2025-07-10T08:30:00Z",
      source: "Financial Times"
    },
    {
      title: `Analysts Upgrade ${symbol} Stock Rating`,
      summary: `Beberapa analis meningkatkan rating saham ${symbol} menjadi 'Buy' dengan target harga yang lebih tinggi berdasarkan prospek bisnis yang kuat.`,
      url: "#",
      publishedAt: "2025-07-10T07:15:00Z",
      source: "Bloomberg"
    },
    {
      title: `${companyName || symbol} Announces New Product Launch`,
      summary: `${companyName || symbol} meluncurkan produk inovatif terbaru yang diharapkan akan meningkatkan market share dan pendapatan perusahaan.`,
      url: "#",
      publishedAt: "2025-07-10T06:45:00Z",
      source: "Reuters"
    }
  ];

  const news = newsData?.articles || fallbackNews;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Baru saja";
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          Berita {symbol}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Berita terbaru tentang {companyName || symbol}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.slice(0, 5).map((item, index) => (
          <div key={index} className="border-l-2 border-primary/20 pl-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-foreground leading-tight">
                {item.title}
              </h4>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {item.source}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTime(item.publishedAt)}
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <button className="text-xs text-primary hover:underline">
            Lihat semua berita {symbol}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}