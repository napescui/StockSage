import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  symbol: string;
}

export default function DataTable({ symbol }: DataTableProps) {
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: historicalData = [], isLoading } = useQuery({
    queryKey: ['/api/stock', symbol, 'history'],
    enabled: !!symbol,
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/stock/${symbol}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${symbol}_data.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const filteredData = historicalData.filter((row: any) =>
    Object.values(row).some((value: any) =>
      value?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortBy) return 0;
    
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortOrder === 'asc' 
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  if (isLoading) {
    return (
      <Card className="bg-surface border-border mt-6">
        <CardHeader>
          <CardTitle className="text-foreground">Financial Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border mt-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <CardTitle className="text-foreground mb-4 md:mb-0">Financial Data</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Filter data..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
              />
              <Filter className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>
            <Button
              onClick={handleExport}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead 
                  className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead 
                  className="text-right text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('open')}
                >
                  Open
                  <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead 
                  className="text-right text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('high')}
                >
                  High
                  <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead 
                  className="text-right text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('low')}
                >
                  Low
                  <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead 
                  className="text-right text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('close')}
                >
                  Close
                  <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead 
                  className="text-right text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('volume')}
                >
                  Volume
                  <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Change
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row: any, index: number) => {
                  const previousClose = sortedData[index + 1]?.close || row.close;
                  const change = ((row.close - previousClose) / previousClose) * 100;
                  const isPositive = change >= 0;
                  
                  return (
                    <TableRow key={row.id} className="border-border hover:bg-background/30 transition-colors">
                      <TableCell className="font-mono text-muted-foreground">{row.date}</TableCell>
                      <TableCell className="font-mono text-foreground text-right">
                        ${row.open?.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-mono text-foreground text-right">
                        ${row.high?.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-mono text-foreground text-right">
                        ${row.low?.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-mono text-foreground text-right">
                        ${row.close?.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-mono text-foreground text-right">
                        {(row.volume / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell className={`font-mono text-right ${isPositive ? 'text-success' : 'text-error'}`}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(sortedData.length, 10)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled className="text-muted-foreground">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm" className="text-muted-foreground">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
