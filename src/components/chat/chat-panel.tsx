
"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Send, Paperclip, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChatMessage, type Message } from "./chat-message";
import { SummarizeButton } from "./summarize-button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "../auth-provider";


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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
        });
        return;
      }
      setSelectedFile(file);
      setInput(prev => `[File: ${file.name}] ${prev}`);
    }
  };

  const handleSendMessage = (text: string, file?: File | null) => {
    if ((text.trim() || file) && user) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        author: "You",
        avatar: user.photoURL || "https://placehold.co/40x40.png",
        text: text,
        timestamp: new Date(),
        file: file ? { name: file.name, size: file.size } : undefined
      };
      setMessages([...messages, newMessage]);
      setInput("");
      setSelectedFile(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(input, selectedFile);
  };

  const handleCall = (type: 'audio' | 'video') => {
    toast({
      title: `Starting ${type} call...`,
      description: "This feature is not yet implemented.",
    });
  }

  return (
    <main className="flex flex-col flex-1 m-2 rounded-lg">
      <Card className="flex-1 flex flex-col shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-card">
          <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleCall('video')}>
                      <Video className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start Video Call</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleCall('audio')}>
                      <Phone className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start Audio Call</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>
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
            <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                          <Paperclip className="w-5 h-5" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach File (Max 10MB)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
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
    </main>
  );
}
