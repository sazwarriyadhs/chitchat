import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Timestamp } from "firebase/firestore";
import { FileIcon } from "lucide-react";

export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: Timestamp | Date; // Allow both types initially
  email?: string;
  file?: {
    name: string;
    size: number;
    url: string;
  };
}

interface ChatMessageProps {
  message: Message;
  currentUserEmail?: string | null;
}

const adminEmail = "shaliaspajakarta@gmail.com";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatTimestamp(timestamp: Timestamp | Date): Date {
    if (timestamp instanceof Date) {
        return timestamp;
    }
    // It's a Firestore Timestamp
    return timestamp.toDate();
}

export function ChatMessage({ message, currentUserEmail }: ChatMessageProps) {
  const isCurrentUser = message.author === "You" || message.email === currentUserEmail;
  const isAuthorAdmin = message.email === adminEmail;
  const displayTimestamp = formatTimestamp(message.timestamp);

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar>
        <AvatarImage src={message.avatar} alt={message.author} data-ai-hint="avatar"/>
        <AvatarFallback>{message.author.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col max-w-xs md:max-w-md",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "p-3 rounded-lg",
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border"
          )}
        >
          {message.file && (
             <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 mb-2 rounded-md bg-black/10 hover:bg-black/20 transition-colors">
                <FileIcon className="w-6 h-6"/>
                <div className="text-sm">
                    <div>{message.file.name}</div>
                    <div className="text-xs opacity-80">{formatBytes(message.file.size)}</div>
                </div>
            </a>
          )}
          {message.text && <p className="text-sm font-medium">{message.text}</p>}
        </div>
        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
          {!isCurrentUser && (
            <div className="flex items-center gap-1">
              <span className="font-bold">{message.author}</span>
              {isAuthorAdmin && <Badge variant="secondary">Admin</Badge>}
            </div>
          )}
          <span>
            {displayTimestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
