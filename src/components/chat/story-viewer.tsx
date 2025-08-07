
"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import type { Story } from "./header";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";

interface StoryViewerProps {
  story: Story;
  children: React.ReactNode;
}

export function StoryViewer({ story, children }: StoryViewerProps) {
  const [reply, setReply] = useState("");
  const { toast } = useToast();

  const handleSendReply = () => {
    if (reply.trim()) {
      toast({
        title: "Reply Sent!",
        description: `Your reply to ${story.user} has been sent.`,
      });
      // Here you would typically call an action to send the reply
      setReply("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md w-full p-0 border-0 overflow-hidden rounded-lg">
        <div className="relative aspect-[9/16] w-full bg-black">
          <Image
            src={story.image}
            alt={`Story by ${story.user}`}
            layout="fill"
            objectFit="contain"
            className="rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Avatar className="w-10 h-8 border-2 border-white">
              <AvatarImage src={story.avatar} alt={story.user} />
              <AvatarFallback>{story.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-white text-base font-bold drop-shadow-md">
              {story.user}
            </span>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white hover:bg-black/50 hover:text-white rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </div>
        <div className="p-3 bg-background flex items-center gap-2">
          <Input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Reply to ${story.user}...`}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendReply();
              }
            }}
          />
          <Button type="button" size="icon" onClick={handleSendReply} disabled={!reply.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
