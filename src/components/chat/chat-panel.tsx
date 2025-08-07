
"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Send, Paperclip, Phone, Video, Loader2 } from "lucide-react";
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
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, type Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const adminEmail = "shaliaspajakarta@gmail.com";

// Firestore data structure for a message
interface FirestoreMessage {
  author: string;
  avatar: string;
  text: string;
  timestamp: Timestamp;
  email?: string;
  file?: {
    name: string;
    size: number;
    url: string;
  };
}

export function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        // Here we cast the doc.data() to FirestoreMessage to ensure type safety from Firestore
        const data = doc.data() as FirestoreMessage;
        msgs.push({
            id: doc.id,
            ...data
        });
      });
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching messages: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch messages from the server."
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


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
      // We don't add the file name to the input anymore as it will be handled on send
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSendMessage = async (text: string, file: File | null) => {
    if ((text.trim() || file) && user) {
      setIsSending(true);
      try {
        let fileData: { name: string; size: number; url: string; } | undefined = undefined;

        if (file) {
            const storage = getStorage();
            const storageRef = ref(storage, `chat_files/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            fileData = { name: file.name, size: file.size, url: downloadURL };
        }

        const messageData: Omit<FirestoreMessage, 'id'> = {
          author: user.displayName || user.email || "Anonymous",
          avatar: user.photoURL || "https://placehold.co/40x40.png",
          text: text.trim(),
          timestamp: serverTimestamp() as Timestamp,
          email: user.email ?? undefined,
          file: fileData
        };

        await addDoc(collection(db, "messages"), messageData);

        setInput("");
        handleRemoveFile();

      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          variant: "destructive",
          title: "Send Error",
          description: "Failed to send message. Please try again.",
        });
      } finally {
        setIsSending(false);
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} currentUserEmail={user?.email} />
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t space-y-2">
            {selectedFile && (
                <div className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                    <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4" />
                        <span className="truncate">{selectedFile.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveFile}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isSending}>
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
              disabled={isSending}
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={isSending || (!input.trim() && !selectedFile)}>
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </main>
  );
}
