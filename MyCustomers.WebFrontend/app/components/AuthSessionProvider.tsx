"use client";

import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut } from "next-auth/react";
import { type ReactNode, useEffect } from "react";

/**
 * Props for the AuthSessionProvider component.
 */
export interface AuthSessionProviderProps {
  /** The current authentication session or null if not authenticated. */
  session: Session | null;
  /** The child components to be wrapped by the authentication provider. */
  children: ReactNode;
}

/**
 * AuthSessionProvider component that wraps the application with NextAuth session management.
 * Automatically handles refresh token errors by triggering re-authentication.
 */
export default function AuthSessionProvider({
  session,
  children,
}: AuthSessionProviderProps) {
  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      signOut();
      signIn("credentials");
    }
  }, [session]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
