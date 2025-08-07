
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface CreateGroupDialogProps {
  users: User[];
}

export function CreateGroupDialog({ users }: CreateGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length >= 5) {
      toast({
        title: "Group Created Successfully!",
        description: `Group "${groupName}" with ${selectedUsers.length} members has been created.`,
      });
      // Reset state and close dialog
      setGroupName("");
      setSelectedUsers([]);
      setIsOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: "Please provide a group name and select at least 5 members.",
        });
    }
  };

  const canCreate = groupName.trim() !== "" && selectedUsers.length >= 5;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Select at least 5 members to create a new group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-name" className="text-right">
              Group Name
            </Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Project Team"
            />
          </div>
          <div className="grid gap-2">
            <Label>Select Members ({selectedUsers.length} selected)</Label>
            <ScrollArea className="h-64 w-full rounded-md border">
              <div className="p-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 mb-2 p-2 rounded-md hover:bg-muted"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                     <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="avatar" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateGroup} disabled={!canCreate}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
