"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, UserCog, GraduationCap, CalendarDays, Bell, LogOut, BookOpen, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["ADMIN", "COORDINATOR", "TEACHER"]
    },
    {
      title: "Coordenadores",
      href: "/admin/coordinators",
      icon: UserCog,
      roles: ["ADMIN"] // Só Admin vê
    },
    {
      title: "Professores",
      href: "/admin/teachers",
      icon: GraduationCap,
      roles: ["ADMIN", "COORDINATOR"] // Admin e Coord veem
    },
    {
      title: "Horário das Aulas",
      href: "/admin/schedule",
      icon: CalendarDays,
      roles: ["ADMIN", "COORDINATOR", "TEACHER"]
    },
    {
      title: "Históricos de Notificação",
      href: "/admin/notifications",
      icon: Bell,
      roles: ["ADMIN", "COORDINATOR", "TEACHER"]
    },
    {
      title: "Configurações",
      href: "/admin/settings",
      icon: Settings,
      roles: ["ADMIN"] // Só Admin vê
    },
  ]

  const filteredItems = sidebarItems.filter(item => 
    userRole && item.roles.includes(userRole)
  )

  return (
    <div className="flex h-full flex-col border-r bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary">
          <BookOpen className="h-6 w-6" />
          <span>ClickAulas</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          {filteredItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all mb-1",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="mb-4 px-2">
            <p className="text-xs text-muted-foreground font-semibold">Logado como:</p>
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole?.toLowerCase()}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}