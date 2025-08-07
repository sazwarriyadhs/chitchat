import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
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
          <p className="text-sm font-medium">{message.text}</p>
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
