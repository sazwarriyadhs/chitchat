import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const stories = [
  { id: 1, user: "Alice", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/F4B400/000000.png", dataAiHint: "nature landscape" },
  { id: 2, user: "Bob", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/DB4437/FFFFFF.png", dataAiHint: "city night" },
  { id: 3, user: "Charlie", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/4285F4/FFFFFF.png", dataAiHint: "beach sunset" },
  { id: 4, user: "Diana", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png", dataAiHint: "mountain hiking" },
  { id: 5, user: "Frank", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png", dataAiHint: "food delicious" },
  { id: 6, user: "David", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png", dataAiHint: "concert music" },
  { id: 7, user: "Eve", image: "https://placehold.co/320x180.png", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png", dataAiHint: "pet cute" },
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
                className="w-full max-w-md lg:max-w-xl"
            >
                <CarouselContent>
                {stories.map((story) => (
                    <CarouselItem key={story.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                      <div className="p-1">
                        <Card className="overflow-hidden rounded-lg group">
                          <div className="relative aspect-video">
                            <Image src={story.image} alt={`Story by ${story.user}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={story.dataAiHint} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                <Avatar className="w-8 h-8 border-2 border-primary">
                                    <AvatarImage src={story.avatar} alt={story.user} />
                                    <AvatarFallback>{story.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-white text-sm font-bold drop-shadow-md">{story.user}</span>
                            </div>
                          </div>
                        </Card>
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
