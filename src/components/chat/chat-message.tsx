import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: Date;
  file?: {
    name: string;
    size: number;
  };
}

interface ChatMessageProps {
  message: Message;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isCurrentUser = message.author === "You";

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
             <div className="flex items-center gap-2 p-2 mb-2 rounded-md bg-black/10">
                <FileIcon className="w-6 h-6"/>
                <div className="text-sm">
                    <div>{message.file.name}</div>
                    <div className="text-xs opacity-80">{formatBytes(message.file.size)}</div>
                </div>
            </div>
          )}
          {message.text && <p className="text-sm font-medium">{message.text}</p>}
        </div>
        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
          {!isCurrentUser && <span className="font-bold">{message.author}</span>}
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
