import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { SessionProvider } from "@/components/admin/session-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SessionProvider session={session}>
      {/* Container Principal: Ocupa toda a tela, sem scroll no body */}
      <div className="flex h-screen w-full overflow-hidden bg-background">
        
        {/* Sidebar: Componente inteligente que controla sua própria largura */}
        <Sidebar />

        {/* Área de Conteúdo: Cresce para ocupar o resto e tem scroll interno */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Fundo decorativo sutil (Gradiente Lilás) */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 scroll-smooth">
            {/* Container centralizado para telas muito grandes */}
            <div className="mx-auto max-w-7xl animate-in fade-in duration-500 slide-in-from-bottom-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}