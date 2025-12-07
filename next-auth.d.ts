import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Na Sessão (Frontend), o role é obrigatório porque nós o injetamos no callback.
   */
  interface Session {
    user: {
      role: Role
    } & DefaultSession["user"]
  }

  /**
   * No User (Adapter/Banco), deixamos opcional para evitar conflito de tipagem
   * com o PrismaAdapter, que espera uma interface mais genérica.
   */
  interface User {
    role?: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
  }
}