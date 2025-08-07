import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header>
      <Card className="flex items-center justify-between p-2 m-2 border-b rounded-lg shadow-sm bg-background">
        <div className="flex items-center gap-2">
          <Image src="/image/logo.png" alt="ChitChat Logo" width={128} height={128} />
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
