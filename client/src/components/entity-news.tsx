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

  const news = newsData?.articles || [];

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
          <a 
            key={index} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block border-l-2 border-primary/20 pl-4 space-y-2 hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
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
          </a>
        ))}
        
        <div className="text-center pt-2">
          <a 
            href={`https://finance.yahoo.com/quote/${symbol}/news`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Lihat semua berita {symbol}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}