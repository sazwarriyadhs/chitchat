
"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page is protected. If the user is authenticated, they will be redirected to the chat.
// The logic in the layout handles the redirection for unauthenticated users.
export default function ProtectedRootPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/chat');
        }
    }, [user, loading, router]);

    // Render nothing or a loader while redirecting
    return null;
}
