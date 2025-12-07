import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { SessionProvider } from "@/components/admin/session-provider"; // Importamos nosso wrapper

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteção: Apenas usuários logados com role válida acessam
  // (A verificação estrita de ADMIN pode ser feita página a página ou aqui se for restrito geral)
  if (!session) {
    redirect("/auth/login");
  }

  return (
    // Envolvemos tudo com o SessionProvider passando a sessão do servidor
    <SessionProvider session={session}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Coluna da Esquerda (Fixa) */}
        <div className="hidden border-r bg-muted/40 md:block h-full">
          <Sidebar />
        </div>

        {/* Coluna da Direita (Conteúdo) */}
        <div className="flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}