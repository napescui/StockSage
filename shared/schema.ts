import { pgTable, text, serial, timestamp, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stockData = pgTable("stock_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  date: text("date").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  volume: integer("volume").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  symbol: text("symbol"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStockDataSchema = createInsertSchema(stockData).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type StockData = typeof stockData.$inferSelect;
export type InsertStockData = z.infer<typeof insertStockDataSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Additional types for API responses
export interface StockInfo {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  pe: number;
  high52w: number;
  low52w: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  sma50: number;
  sma200: number;
}

export interface ChartData {
  date: string;
  price: number;
  volume: number;
}
