"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChatMessage, type Message } from "./chat-message";
import { SummarizeButton } from "./summarize-button";

const initialMessages: Message[] = [
  {
    id: "1",
    author: "Alice",
    avatar: "https://placehold.co/40x40/F4B400/000000.png",
    text: "Hey everyone! How's the new project planning coming along?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    author: "Bob",
    avatar: "https://placehold.co/40x40/DB4437/FFFFFF.png",
    text: "Going well! I've drafted the initial specs. I'll share them by EOD.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    author: "You",
    avatar: "https://placehold.co/40x40.png",
    text: "Great, thanks Bob! Let me know if you need another pair of eyes on it.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "4",
    author: "Charlie",
    avatar: "https://placehold.co/40x40/4285F4/FFFFFF.png",
    text: "I've been working on the design mockups. The new component library is a dream to work with. I think we can build a really intuitive interface.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "5",
    author: "Charlie",
    avatar: "https://placehold.co/40x40/4285F4/FFFFFF.png",
    text: "Speaking of which, we need to decide on the color palette for the dashboard widgets. Any strong opinions? I was thinking we could use the new accent color more prominently.",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        author: "You",
        avatar: "https://placehold.co/40x40.png",
        text: input,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  return (
    <Card className="flex flex-col flex-1 m-2 rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-end">
        <SummarizeButton messages={messages} />
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
