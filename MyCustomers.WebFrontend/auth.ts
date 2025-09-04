import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServiceEndpoint } from "./app/lib/service-discovery";
import type { AccessTokenResponse } from "./app/lib/types/AccessTokenResponse";
import type { LoginRequest } from "./app/lib/types/LoginRequest";
import type { RefreshRequest } from "./app/lib/types/RefreshRequest";
import type { UserDto } from "./app/lib/types/UserDto";

export const config: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Identity",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const loginRequest: LoginRequest = {
          email: credentials.email,
          password: credentials.password,
        };

        const loggedInAt = Math.floor(Date.now() / 1000);

        const loginResponse = await fetch(
          `${getServiceEndpoint("webapi")}/api/identity/login`,
          {
            method: "POST",
            body: JSON.stringify(loginRequest),
            headers: { "Content-Type": "application/json" },
          },
        );

        const accessTokenResponse = (await loginResponse
          .json()
          .catch(() => null)) as AccessTokenResponse | null;

        if (!loginResponse.ok || !accessTokenResponse) {
          return null;
        }

        const meResponse = await fetch(
          `${getServiceEndpoint("webapi")}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${accessTokenResponse.accessToken}`,
            },
          },
        );

        const user = (await meResponse
          .json()
          .catch(() => null)) as UserDto | null;

        if (!meResponse.ok || !user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          accessToken: accessTokenResponse.accessToken,
          expiresAt: accessTokenResponse.expiresIn + loggedInAt,
          refreshToken: accessTokenResponse.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          accessToken: user.accessToken,
          expiresAt: user.expiresAt,
          refreshToken: user.refreshToken,
        };
      }

      if (Date.now() < (token.expiresAt - 60) * 1000) {
        return token;
      }

      try {
        const refreshRequest: RefreshRequest = {
          refreshToken: token.refreshToken,
        };
        const response = await fetch(
          `${getServiceEndpoint("webapi")}/api/identity/refresh`,
          {
            method: "POST",
            body: JSON.stringify(refreshRequest),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const tokensOrError = await response.json();

        if (!response.ok) {
          throw tokensOrError;
        }

        const newTokens = tokensOrError as AccessTokenResponse;

        return {
          ...token,
          accessToken: newTokens.accessToken,
          expiresAt: Math.floor(Date.now() / 1000 + newTokens.expiresIn),
          refreshToken: newTokens.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing accessToken", error);

        return {
          ...token,
          error: "RefreshTokenError",
        };
      }
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        error: token.error,
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

declare module "next-auth" {
  interface User {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
  }

  interface Session {
    accessToken?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
    error?: "RefreshTokenError";
  }
}
