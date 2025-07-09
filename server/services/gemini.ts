import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function analyzeStock(symbol: string, stockInfo: any, message: string): Promise<string> {
  const prompt = `You are a professional stock analyst. The user is asking about ${symbol} stock.

Current stock information:
- Symbol: ${symbol}
- Current Price: ${stockInfo?.currentPrice || 'N/A'}
- Market Cap: ${stockInfo?.marketCap || 'N/A'}
- P/E Ratio: ${stockInfo?.pe || 'N/A'}
- 52 Week High: ${stockInfo?.high52w || 'N/A'}
- Volume: ${stockInfo?.volume || 'N/A'}

User question: ${message}

Please provide a comprehensive analysis based on the current data and general market knowledge. Be professional and informative. Format your response in plain text without using markdown symbols like ** or *, and use proper spacing and paragraphs. Keep the response conversational and easy to read.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    let text = response.text || "I apologize, but I'm unable to provide an analysis at this time.";
    
    // Clean up markdown formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold markdown
    text = text.replace(/\*(.*?)\*/g, '$1'); // Remove italic markdown
    text = text.replace(/_{2,}/g, ''); // Remove underscores
    text = text.replace(/#{1,6}\s*/g, ''); // Remove headers
    text = text.replace(/\n{3,}/g, '\n\n'); // Limit line breaks
    
    return text;
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
