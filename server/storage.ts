import { stockData, chatMessages, type StockData, type InsertStockData, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  // Stock data operations
  insertStockData(data: InsertStockData): Promise<StockData>;
  getStockDataBySymbol(symbol: string): Promise<StockData[]>;
  deleteStockDataBySymbol(symbol: string): Promise<void>;
  
  // Chat operations
  insertChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySymbol(symbol: string): Promise<ChatMessage[]>;
  getAllChatMessages(): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private stockDataStore: Map<number, StockData>;
  private chatMessagesStore: Map<number, ChatMessage>;
  private currentStockDataId: number;
  private currentChatMessageId: number;

  constructor() {
    this.stockDataStore = new Map();
    this.chatMessagesStore = new Map();
    this.currentStockDataId = 1;
    this.currentChatMessageId = 1;
  }

  async insertStockData(data: InsertStockData): Promise<StockData> {
    const id = this.currentStockDataId++;
    const stockDataItem: StockData = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.stockDataStore.set(id, stockDataItem);
    return stockDataItem;
  }

  async getStockDataBySymbol(symbol: string): Promise<StockData[]> {
    return Array.from(this.stockDataStore.values())
      .filter(item => item.symbol === symbol)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async deleteStockDataBySymbol(symbol: string): Promise<void> {
    const entries = Array.from(this.stockDataStore.entries());
    for (const [id, item] of entries) {
      if (item.symbol === symbol) {
        this.stockDataStore.delete(id);
      }
    }
  }

  async insertChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const chatMessage: ChatMessage = {
      id,
      message: message.message,
      response: message.response,
      symbol: message.symbol || null,
      createdAt: new Date(),
    };
    this.chatMessagesStore.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessagesBySymbol(symbol: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessagesStore.values())
      .filter(msg => msg.symbol === symbol)
      .sort((a, b) => (a.createdAt || new Date()).getTime() - (b.createdAt || new Date()).getTime());
  }

  async getAllChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessagesStore.values())
      .sort((a, b) => (a.createdAt || new Date()).getTime() - (b.createdAt || new Date()).getTime());
  }
}

export const storage = new MemStorage();
