import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userFound = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!userFound) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userFound.password,
        );
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: userFound.id,
          email: userFound.email,
          name: userFound.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "github") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              password: "", // GitHub users don't need password
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
      };
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
