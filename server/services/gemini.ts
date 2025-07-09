import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function analyzeStock(symbol: string, stockInfo: any, message: string): Promise<string> {
  const prompt = `You are a professional stock analyst. The user is asking about ${symbol} stock.

Current stock information:
- Symbol: ${symbol}
- Current Price: ${stockInfo.currentPrice}
- Market Cap: ${stockInfo.marketCap}
- P/E Ratio: ${stockInfo.pe}
- 52 Week High: ${stockInfo.high52w}
- Volume: ${stockInfo.volume}

User question: ${message}

Please provide a comprehensive analysis based on the current data and general market knowledge. Be professional and informative.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I apologize, but I'm unable to provide an analysis at this time.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm experiencing technical difficulties. Please try again later.";
  }
}

export async function generateStockInsight(symbol: string, stockData: any[]): Promise<string> {
  const recentData = stockData.slice(0, 5);
  const prompt = `Analyze the recent stock performance for ${symbol} based on this data:

${recentData.map(d => `Date: ${d.date}, Open: ${d.open}, High: ${d.high}, Low: ${d.low}, Close: ${d.close}, Volume: ${d.volume}`).join('\n')}

Provide a brief technical analysis and outlook.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Unable to generate insight at this time.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Technical analysis temporarily unavailable.";
  }
}
