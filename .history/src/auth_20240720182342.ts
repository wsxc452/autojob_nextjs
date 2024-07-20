import NextAuth, { User, NextAuthConfig, Session, AuthError } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
// import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import type { Provider } from "next-auth/providers";
import { CallbackRouteError, CredentialsSignin } from "@auth/core/errors";
import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect";
import { ZodError } from "zod";

console.log(process.env.AUTH_GITHUB_ID);
export const BASE_PATH = "/api/auth";
class CustomError extends CredentialsSignin {
  code = "custom_error";
}
const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials): Promise<any | null> {
      console.log("credentials.....111", credentials);
      // const user = { id: user.id, name: credentials.username:, email: credentials.password };
      try {
        const users = [
          {
            id: "test-user-1",
            userName: "wsxc451",
            name: "Test 1",
            password: "xiaocao11",
            email: "wsxc452@gmail.com",
          },
          {
            id: "test-user-2",
            userName: "test2",
            name: "Test 2",
            password: "pass",
            email: "test2@donotreply.com",
          },
        ];
        const user = users.find(
          (user) =>
            user.email === credentials.email &&
            user.password === credentials.password,
        );
        if (!user) {
          // throw new CustomError("用户名或密码错误");
          throw new Error("User not found.");
        } else {
          return user;
        }
      } catch (error: any) {
        if (error instanceof ZodError) {
          // Return `null` to indicate that the credentials are invalid
          return null;
        }
        // throw new Error("Invalid username or password");
        // if (isRedirectError(error)) {
        //   console.error(error);
        //   throw error;
        // }
        // if (error instanceof CallbackRouteError) {
        //   throw new Error(error.message || "用户名或密码错误12");
        // }
        // throw new CustomError("用户名或密码错误");
        // console.error("Authorization error:", error.message);
        // throw new Error(error.message);
        // throw new CustomError("用户名或密码错误");
      }
    },
  }),
  GithubProvider({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
];
const publicPaths = ["/auth/signin", "/auth/signup"];
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async authorized({ request, auth }) {
      const url = request.nextUrl;
      if (
        !auth?.user &&
        !publicPaths.some((path) => url.pathname.startsWith(path))
      ) {
        return NextResponse.redirect(new URL("/api/auth/signin", request.url));
      }
      return !!auth?.user;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn.....", user, account, profile, email, credentials);
      return true;
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt.....", token, user);
      // console.log("user.....", user);
      if (user) {
        // User is available during sign-in
        token.id = user.id || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token?.id + "" || "";
      }
      return session;
    },
  },
  providers: providers,
  debug: false,
  basePath: BASE_PATH,
  session: {
    strategy: "jwt",
    maxAge: 2592000,
    updateAge: 2591000,
  },
  pages: {
    // signIn: "/auth/signin",
    // error: "/auth/error",
    // signOut: "/auth/signout",
  },
});
// export const providerMap = providers.map((provider) => {
//   if (typeof provider === "function") {
//     console.log('1')
//     const providerData = provider();
//     return { id: providerData.id, name: providerData.name };
//   } else {
//     return { id: provider.id, name: provider.name };
//   }
// });
