
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreateGroupDialog } from "./create-group-dialog"
import { Badge } from "@/components/ui/badge"

const adminEmail = "shaliaspajakarta@gmail.com";

const onlineUsers = [
  { id: "1", name: "Alice", avatar: "https://placehold.co/40x40/F4B400/000000.png", status: "Online", email: "alice@example.com" },
  { id: "2", name: "Bob", avatar: "https://placehold.co/40x40/DB4437/FFFFFF.png", status: "In a meeting", email: "bob@example.com" },
  { id: "3", name: "Charlie", avatar: "https://placehold.co/40x40/4285F4/FFFFFF.png", status: "Away", email: "charlie@example.com" },
  { id: "4", name: "Diana", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png", status: "Coding", email: "diana@example.com" },
  { id: "5", name: "Admin ShalIa", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png", status: "On a call", email: adminEmail },
];

const offlineUsers = [
  { id: "6", name: "David", avatar: "https://placehold.co/40x40/0F9D58/FFFFFF.png", status: "Offline", email: "david@example.com" },
  { id: "7", name: "Eve", avatar: "https://placehold.co/40x40/7B1FA2/FFFFFF.png", status: "Offline", email: "eve@example.com" },
];

const allUsers = [...onlineUsers, ...offlineUsers];

const User = ({ name, avatar, isOnline, status, email }: { name: string; avatar: string; isOnline: boolean; status: string, email: string }) => (
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
        <div className="flex items-center gap-2">
            <span className="font-medium">{name}</span>
            {email === adminEmail && <Badge variant="secondary">Admin</Badge>}
        </div>
      <span className="text-xs text-muted-foreground">{status}</span>
    </div>
  </div>
);

export function UserList() {
  return (
    <aside className="hidden md:flex flex-col w-72 m-2 mr-0">
      <Card className="flex-1 flex flex-col rounded-lg shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Status</CardTitle>
          <CreateGroupDialog users={allUsers} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 overflow-y-auto">
          
          <Separator />

          <div>
            <h3 className="mb-2 px-6 text-sm font-semibold text-muted-foreground">Online — {onlineUsers.length}</h3>
            <div className="flex flex-col gap-1 px-4">
              {onlineUsers.map((user) => (
                <User key={user.name} {...user} isOnline />
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 px-6 text-sm font-semibold text-muted-foreground">Offline — {offlineUsers.length}</h3>
            <div className="flex flex-col gap-1 px-4">
              {offlineUsers.map((user) => (
                <User key={user.name} {...user} isOnline={false} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
