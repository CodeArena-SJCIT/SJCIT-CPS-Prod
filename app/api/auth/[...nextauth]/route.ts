import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { UserRole } from "@/lib/types"

// Hardcoded users for temporary access
const hardcodedUsers = [
  {
    id: "hod-1",
    name: "Dr. Rajesh Kumar",
    email: "hod@example.com",
    password: "hod123",
    role: "hod",
    department: "Computer Science",
  },
  {
    id: "faculty-1",
    name: "Dr. Priya Sharma",
    email: "faculty@example.com",
    password: "faculty123",
    role: "faculty",
    department: "Computer Science",
  },
]

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in hardcoded list
        const user = hardcodedUsers.find((u) => u.email === credentials.email && u.password === credentials.password)

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role as UserRole
        session.user.department = token.department
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "THIS_IS_A_FALLBACK_SECRET_CHANGE_IT",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
