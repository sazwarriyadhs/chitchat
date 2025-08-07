import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const onlineUsers = [
  { name: "Alice", avatar: "https://placehold.co/40x40/F4B400/000000.png", status: "Online" },
  { name: "Bob", avatar: "https://placehold.co/40x40/DB4437/FFFFFF.png", status: "In a meeting" },
  { name: "Charlie", avatar: "https://placehold.co/40x40/4285F4/FFFFFF.png", status: "Away" },
];

const offlineUsers = [
  { name: "David", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png", status: "Offline" },
  { name: "Eve", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png", status: "Offline" },
];

const User = ({ name, avatar, isOnline, status }: { name: string; avatar: string; isOnline: boolean; status: string }) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
    <div className="relative">
      <Avatar>
        <AvatarImage src={avatar} alt={`${name}'s avatar`} data-ai-hint="avatar" />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
      />
    </div>
    <div className="flex flex-col">
      <span className="font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{status}</span>
    </div>
  </div>
);

export function UserList() {
  return (
    <Card className="hidden md:flex flex-col w-64 m-2 mr-0 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 overflow-y-auto">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Online — {onlineUsers.length}</h3>
          <div className="flex flex-col gap-1">
            {onlineUsers.map((user) => (
              <User key={user.name} {...user} isOnline />
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Offline — {offlineUsers.length}</h3>
          <div className="flex flex-col gap-1">
            {offlineUsers.map((user) => (
              <User key={user.name} {...user} isOnline={false} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
