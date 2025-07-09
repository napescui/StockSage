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
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
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
