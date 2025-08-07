import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const onlineUsers = [
  { name: "Alice", avatar: "https://placehold.co/40x40/F4B400/000000.png" },
  { name: "Bob", avatar: "https://placehold.co/40x40/DB4437/FFFFFF.png" },
  { name: "Charlie", avatar: "https://placehold.co/40x40/4285F4/FFFFFF.png" },
  { name: "Diana", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png" },
  { name: "Frank", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png" },
  { name: "David", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png" },
  { name: "Eve", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png" },
];


export function Header() {
  return (
    <header>
      <Card className="flex items-center justify-between p-2 m-2 border-b rounded-lg shadow-sm bg-background">
        <div className="flex items-center gap-2">
          <Image src="/image/logo.png" alt="ChitChat Logo" width={128} height={128} className="w-32 h-auto" />
        </div>
        
        <div className="flex-1 flex justify-center px-4">
            <Carousel
                opts={{
                align: "start",
                }}
                className="w-full max-w-sm md:max-w-md lg:max-w-lg"
            >
                <CarouselContent>
                {onlineUsers.map((user, index) => (
                    <CarouselItem key={index} className="basis-1/5 md:basis-1/6 lg:basis-1/8">
                    <div className="p-1">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Avatar className="w-14 h-14 border-2 border-primary">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="avatar story" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium truncate">{user.name}</span>
                        </div>
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">You</span>
          </div>
          <ThemeToggle />
        </div>
      </Card>
    </header>
  )
}
