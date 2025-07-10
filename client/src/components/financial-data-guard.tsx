import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock } from "lucide-react";

interface FinancialDataGuardProps {
  children: React.ReactNode;
  title?: string;
}

export default function FinancialDataGuard({ children, title = "Data Finansial" }: FinancialDataGuardProps) {
  const [isVerified, setIsVerified] = useState(false);

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">
          Data finansial memerlukan verifikasi sebelum ditampilkan untuk memastikan keamanan informasi.
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          onClick={() => setIsVerified(true)}
          className="flex items-center gap-2"
          size="lg"
        >
          <Eye className="w-4 h-4" />
          Tampilkan Data Finansial
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Klik untuk mengakses informasi finansial lengkap
        </p>
      </CardContent>
    </Card>
  );
}