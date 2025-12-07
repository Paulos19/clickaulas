import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

// Exportação padrão do middleware de autenticação
export default auth

// Configuração para não rodar em arquivos estáticos ou imagens
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}