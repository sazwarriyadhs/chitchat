
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreateGroupDialog } from "./create-group-dialog";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

const adminEmail = "shaliaspajakarta@gmail.com";

export interface AppUser {
  id: string;
  name: string;
  avatar: string;
  status: "Online" | "Offline" | string;
  email: string;
}

const User = ({ name, avatar, isOnline, status, email }: { name:string, avatar: string, isOnline: boolean, status: string, email: string }) => (
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

const UserListSkeleton = () => (
    <div className="flex flex-col gap-4 px-4">
        <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="flex flex-col gap-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <Separator/>
        <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="flex flex-col gap-2">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)


export function UserList() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: AppUser[] = [];
            snapshot.forEach(doc => {
                usersData.push({ id: doc.id, ...doc.data() } as AppUser);
            });
            setUsers(usersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching users: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const onlineUsers = users.filter(u => u.status !== "Offline");
    const offlineUsers = users.filter(u => u.status === "Offline");

  return (
    <aside className="hidden md:flex flex-col w-72 m-2 mr-0">
      <Card className="flex-1 flex flex-col rounded-lg shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Status</CardTitle>
          <CreateGroupDialog users={users} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 overflow-y-auto">
          {isLoading ? <UserListSkeleton /> : (
            <>
                <Separator />
                <div>
                    <h3 className="mb-2 px-6 text-sm font-semibold text-muted-foreground">Online — {onlineUsers.length}</h3>
                    <div className="flex flex-col gap-1 px-4">
                    {onlineUsers.map((user) => (
                        <User key={user.id} {...user} isOnline />
                    ))}
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="mb-2 px-6 text-sm font-semibold text-muted-foreground">Offline — {offlineUsers.length}</h3>
                    <div className="flex flex-col gap-1 px-4">
                    {offlineUsers.map((user) => (
                        <User key={user.id} {...user} isOnline={false} />
                    ))}
                    </div>
                </div>
            </>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}
