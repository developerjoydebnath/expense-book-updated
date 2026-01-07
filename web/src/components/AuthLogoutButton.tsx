"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AuthLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/auth/login");
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="ml-2">
      Logout
    </Button>
  );
}
