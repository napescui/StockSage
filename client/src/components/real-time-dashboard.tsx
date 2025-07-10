import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Activity } from "lucide-react";

interface RealTimeDashboardProps {
  symbol: string;
}

export default function RealTimeDashboard({ symbol }: RealTimeDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <Card className="bg-surface border-border mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg">Dashboard Real-Time</CardTitle>
          <Badge variant="outline" className="text-green-500 border-green-500">
            <Activity className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tanggal Hari Ini</p>
              <p className="font-medium text-foreground">{formatDate(currentTime)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Waktu Real-Time</p>
              <p className="font-mono font-medium text-foreground">{formatTime(currentTime)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Simbol Aktif</p>
              <p className="font-medium text-foreground">{symbol || 'Belum dipilih'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}