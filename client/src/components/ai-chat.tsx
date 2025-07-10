import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, User, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Component to render markdown-formatted text
function MarkdownText({ text }: { text: string }) {
  const renderText = (text: string) => {
    // Convert **text** to bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold text-foreground">{boldText}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="text-sm text-foreground whitespace-pre-wrap">
      {renderText(text)}
    </div>
  );
}

interface AIChatProps {
  currentSymbol: string;
}

export default function AIChat({ currentSymbol }: AIChatProps) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: chatHistory = [] } = useQuery({
    queryKey: [`/api/chat/${currentSymbol}`],
    enabled: !!currentSymbol,
  });

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; symbol?: string }) => {
      const response = await apiRequest('POST', '/api/chat', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/${currentSymbol}`] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    chatMutation.mutate({
      message,
      symbol: currentSymbol,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-surface border-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">AI Assistant</CardTitle>
          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-64 mb-4 scrollbar-thin">
          <div className="space-y-4">
            {/* Welcome message */}
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-background/50 rounded-lg p-3 max-w-xs">
                <MarkdownText text={`Hello! 👋 I'm your AI assistant. Ask me anything about **${currentSymbol || 'stocks'}** or market analysis! 📈`} />
              </div>
            </div>

            {/* Chat history */}
            {chatHistory.map((chat: any, index: number) => (
              <div key={index} className="space-y-2">
                {/* User message */}
                <div className="flex items-start space-x-2 justify-end">
                  <div className="bg-primary/20 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-foreground">{chat.message}</p>
                  </div>
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>

                {/* AI response */}
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 max-w-xs">
                    <MarkdownText text={chat.response} />
                  </div>
                </div>
              </div>
            ))}

            {/* Loading state */}
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-background/50 rounded-lg p-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            placeholder="Tanyakan tentang analisis pasar, tren, atau strategi investasi..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-background border-border text-foreground min-h-[80px] resize-none"
            disabled={chatMutation.isPending}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {message.length}/2000 karakter
            </span>
            <Button
              onClick={handleSendMessage}
              disabled={chatMutation.isPending || !message.trim() || message.length > 2000}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {chatMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {chatMutation.isPending ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
