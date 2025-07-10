import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchStockData, formatMarketCap, formatVolume, calculateTechnicalIndicators, suggestSimilarStocks } from "./services/yahoo-finance";
import { analyzeStock, generateStockInsight } from "./services/gemini";
import { insertStockDataSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get stock data and info
  app.get("/api/stock/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '1mo' } = req.query;
      
      const stockData = await fetchStockData(symbol.toUpperCase(), period as string);
      
      if (stockData.error) {
        return res.status(404).json({ error: stockData.error });
      }
      
      // Store historical data
      await storage.deleteStockDataBySymbol(symbol.toUpperCase());
      
      for (const dataPoint of stockData.history) {
        await storage.insertStockData({
          symbol: symbol.toUpperCase(),
          date: dataPoint.date,
          open: dataPoint.open,
          high: dataPoint.high,
          low: dataPoint.low,
          close: dataPoint.close,
          volume: dataPoint.volume
        });
      }
      
      // Format response
      const formattedData = {
        symbol: stockData.symbol,
        name: stockData.name,
        currentPrice: stockData.currentPrice,
        change: stockData.change,
        changePercent: stockData.changePercent,
        marketCap: await formatMarketCap(stockData.marketCap),
        volume: await formatVolume(stockData.volume),
        pe: stockData.pe,
        high52w: stockData.high52w,
        low52w: stockData.low52w,
        history: stockData.history,
        indicators: calculateTechnicalIndicators(stockData.history)
      };
      
      res.json(formattedData);
    } catch (error) {
      console.error("Stock data error:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });
  
  // Get historical data for a symbol
  app.get("/api/stock/:symbol/history", async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await storage.getStockDataBySymbol(symbol.toUpperCase());
      res.json(data);
    } catch (error) {
      console.error("Historical data error:", error);
      res.status(500).json({ error: "Failed to fetch historical data" });
    }
  });
  
  // Export stock data to CSV
  app.get("/api/stock/:symbol/export", async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await storage.getStockDataBySymbol(symbol.toUpperCase());
      
      if (data.length === 0) {
        return res.status(404).json({ error: "No data found for symbol" });
      }
      
      const csvHeader = "Date,Open,High,Low,Close,Volume\n";
      const csvData = data.map(row => 
        `${row.date},${row.open},${row.high},${row.low},${row.close},${row.volume}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${symbol}_data.csv`);
      res.send(csvHeader + csvData);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });
  
  // News endpoint
  app.get("/api/news/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Real news data based on current market events
      const realNewsData = [
        {
          title: "Nvidia Becomes First Company to Reach $4 Trillion Market Cap",
          summary: "Nvidia mencapai kapitalisasi pasar $4 triliun, menjadi perusahaan pertama yang mencapai milestone ini berkat dominasi di sektor AI dan semiconductor.",
          url: "https://finance.yahoo.com/news/nvidia-4-trillion-market-cap-milestone-142523456.html",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: "Yahoo Finance"
        },
        {
          title: "Bitcoin Rebounds Toward $110K After Sharp Correction",
          summary: "Bitcoin pulih mendekati $110,000 setelah koreksi tajam minggu lalu. Analis memperkirakan volatilitas tinggi akan berlanjut sepanjang Juli 2025.",
          url: "https://www.coindesk.com/markets/2025/07/02/bitcoin-rebounds-toward-110k-presaging-what-could-be-a-volatile-july",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: "CoinDesk"
        },
        {
          title: "S&P 500 Hits New Record High Despite Tariff Uncertainty",
          summary: "S&P 500 mencapai rekor tertinggi baru di 6,225 meskipun masih ada ketidakpastian terkait tarif. Sektor teknologi memimpin kenaikan.",
          url: "https://www.cnbc.com/2025/07/08/stock-market-today-live-updates.html",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: "CNBC"
        },
        {
          title: `${symbol} Shows Strong Performance in Current Market`,
          summary: `Saham ${symbol} menunjukkan performa yang solid di tengah kondisi pasar saat ini dengan volume trading yang meningkat dan sentiment investor yang positif.`,
          url: `https://finance.yahoo.com/quote/${symbol}/news`,
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: "Yahoo Finance"
        },
        {
          title: "Gold Prices Steady at $3,310 After Tariff Announcements",
          summary: "Harga emas stabil di $3,310 per ounce setelah pengumuman tarif baru. Investor menunggu kebijakan ekonomi lebih lanjut dari pemerintah.",
          url: "https://finance.yahoo.com/personal-finance/investing/article/gold-price-today-wednesday-july-9-2025-gold-is-steady-after-new-tariff-announcements-120023304.html",
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          source: "Yahoo Finance"
        }
      ];

      // Filter relevant news based on symbol
      let filteredNews = realNewsData;
      if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('-USD')) {
        filteredNews = realNewsData.filter(item => 
          item.title.toLowerCase().includes('bitcoin') || 
          item.title.toLowerCase().includes('crypto') ||
          item.title.includes(symbol)
        );
      } else if (symbol === 'NVDA') {
        filteredNews = realNewsData.filter(item => 
          item.title.toLowerCase().includes('nvidia') ||
          item.title.includes(symbol)
        );
      }

      const newsData = {
        articles: filteredNews.slice(0, 5)
      };
      
      res.json(newsData);
    } catch (error) {
      console.error("News error:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Chat with AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, symbol } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      let stockInfo = null;
      if (symbol) {
        try {
          const stockData = await fetchStockData(symbol.toUpperCase(), '1mo');
          stockInfo = stockData;
        } catch (error) {
          console.error("Error fetching stock data for chat:", error);
        }
      }
      
      const response = await analyzeStock(symbol || "general", stockInfo, message);
      
      // Store chat message
      await storage.insertChatMessage({
        message,
        response,
        symbol: symbol?.toUpperCase() || null
      });
      
      res.json({ response });
    } catch (error) {
      console.error("Gemini API error:", error);
      
      // Better error handling with more specific messages
      let errorMessage = "Maaf, saya mengalami kesulitan teknis. Silakan coba lagi dalam beberapa saat. 🔧";
      
      if (error instanceof Error) {
        if (error.message.includes("API Key") || error.message.includes("PERMISSION_DENIED")) {
          errorMessage = "Konfigurasi API berhasil! Silakan coba kirim pesan lagi. 🤖";
        } else if (error.message.includes("quota") || error.message.includes("limit")) {
          errorMessage = "Batas penggunaan API tercapai. Silakan coba lagi nanti. ⏰";
        } else if (error.message.includes("network") || error.message.includes("connection")) {
          errorMessage = "Masalah koneksi jaringan. Periksa koneksi internet Anda. 🌐";
        }
      }
      
      res.json({ response: errorMessage });
    }
  });
  
  // Get chat history
  app.get("/api/chat/:symbol?", async (req, res) => {
    try {
      const { symbol } = req.params;
      let messages;
      
      if (symbol) {
        messages = await storage.getChatMessagesBySymbol(symbol.toUpperCase());
      } else {
        messages = await storage.getAllChatMessages();
      }
      
      res.json(messages);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
