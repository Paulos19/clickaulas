// auth.config.ts
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // CORREÇÃO AQUI:
        // Se user.role for undefined, usamos "TEACHER" como fallback.
        token.role = user.role ?? "TEACHER"; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnAuth = nextUrl.pathname.startsWith('/')

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl))
      }

      return true
    },
  },
  pages: {
    signIn: '/login',
  }
} satisfies NextAuthConfig