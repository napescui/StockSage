import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PriceTicker from "@/components/price-ticker";
import { FinancialInstrument } from "@shared/financial-data";

interface LazyCategoryViewProps {
  category: string;
  instruments: FinancialInstrument[];
}

const ITEMS_PER_BATCH = 20; // Load 20 items at a time
const LOAD_THRESHOLD = 300; // Load more when user is 300px from bottom

export default function LazyCategoryView({ category, instruments }: LazyCategoryViewProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: `${LOAD_THRESHOLD}px`,
        threshold: 0.1,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load more items when sentinel is visible
  useEffect(() => {
    if (isIntersecting && visibleCount < instruments.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + ITEMS_PER_BATCH, instruments.length));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, visibleCount, instruments.length]);

  const visibleInstruments = instruments.slice(0, visibleCount);
  const hasMore = visibleCount < instruments.length;

  return (
    <div ref={containerRef} className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {category === 'stocks' && '📈 Saham'}
        {category === 'indices' && '📊 Indeks'}
        {category === 'bonds' && '🏦 Obligasi'}
        {category === 'crypto' && '₿ Kripto'}
        {category === 'commodities' && '🥇 Komoditas'}
        <span className="text-sm text-muted-foreground ml-2">
          ({visibleCount} dari {instruments.length})
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleInstruments.map((instrument) => (
          <InstrumentCard key={instrument.symbol} instrument={instrument} />
        ))}
        
        {/* Loading skeletons for next batch */}
        {hasMore && isIntersecting && (
          <>
            {Array.from({ length: Math.min(ITEMS_PER_BATCH, instruments.length - visibleCount) }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="bg-surface border-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Sentinel element for intersection observer */}
      {hasMore && (
        <div ref={sentinelRef} className="h-4 flex justify-center">
          {isIntersecting && (
            <div className="text-sm text-muted-foreground">
              Memuat lebih banyak...
            </div>
          )}
        </div>
      )}

      {!hasMore && instruments.length > ITEMS_PER_BATCH && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Semua {instruments.length} instrumen telah dimuat
        </div>
      )}
    </div>
  );
}

interface InstrumentCardProps {
  instrument: FinancialInstrument;
}

function InstrumentCard({ instrument }: InstrumentCardProps) {
  return (
    <Link href={`/asset/${instrument.symbol}`}>
      <Card className="bg-surface border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {instrument.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {instrument.symbol}
                </p>
              </div>
              <div className="flex-shrink-0 ml-2">
                <PriceTicker symbol={instrument.symbol} className="text-xs" />
              </div>
            </div>
            {instrument.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {instrument.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}