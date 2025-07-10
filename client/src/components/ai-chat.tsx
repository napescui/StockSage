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
    <Card className="bg-surface border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">AI Assistant</CardTitle>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-48 mb-3">
          <div className="space-y-3">
            {/* Welcome message */}
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-muted rounded-lg p-2 text-sm max-w-[200px]">
                <MarkdownText text={`Halo! Tanya saya tentang **${currentSymbol || 'saham'}** 📊`} />
              </div>
            </div>

            {/* Chat history */}
            {chatHistory.map((chat: any, index: number) => (
              <div key={index} className="space-y-2">
                {/* User message */}
                <div className="flex items-start space-x-2 justify-end">
                  <div className="bg-primary rounded-lg p-2 max-w-[180px] text-right">
                    <p className="text-sm text-white">{chat.message}</p>
                  </div>
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* AI response */}
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-muted-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-2 max-w-[180px]">
                    <MarkdownText text={chat.response} />
                  </div>
                </div>
              </div>
            ))}

            {/* Loading state */}
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-muted-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-2 max-w-[180px]">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Tanyakan tentang analisis..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-sm"
              disabled={chatMutation.isPending}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={chatMutation.isPending || !message.trim()}
            size="sm"
            className="px-3"
          >
            {chatMutation.isPending ? (
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
