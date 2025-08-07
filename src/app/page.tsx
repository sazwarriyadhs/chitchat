import { Header } from "@/components/chat/header";
import { UserList } from "@/components/chat/user-list";
import { ChatPanel } from "@/components/chat/chat-panel";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <UserList />
        <ChatPanel />
      </main>
    </div>
  );
}
