"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

const AuthContext = createContext({ user: null as any, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isPublicPath = ["/auth/login", "/auth/register", "/auth/forgot-password"].some(path => 
      window.location.pathname.startsWith(path)
    );

    if (!loading && !user && !isPublicPath) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
