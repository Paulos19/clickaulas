"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, UserCog, GraduationCap, CalendarDays, 
  Bell, LogOut, BookOpen, Settings, ChevronLeft, ChevronRight,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role
  
  // Estado de colapso (inicia aberto em telas grandes)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  // Itens do Menu
  const sidebarItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN", "COORDINATOR", "TEACHER"] },
    { title: "Coordenadores", href: "/admin/coordinators", icon: UserCog, roles: ["ADMIN"] },
    { title: "Professores", href: "/admin/teachers", icon: GraduationCap, roles: ["ADMIN", "COORDINATOR"] },
    { title: "Horário das Aulas", href: "/admin/schedule", icon: CalendarDays, roles: ["ADMIN", "COORDINATOR", "TEACHER"] },
    { title: "Notificações", href: "/admin/notifications", icon: Bell, roles: ["ADMIN", "COORDINATOR", "TEACHER"] },
    { title: "Configurações", href: "/admin/settings", icon: Settings, roles: ["ADMIN"] },
  ]

  const filteredItems = sidebarItems.filter(item => 
    userRole && item.roles.includes(userRole)
  )

  // Variantes de Animação
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" }
  }

  return (
    <>
      {/* Mobile Trigger (Visível apenas em telas pequenas) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar Container */}
      <TooltipProvider delayDuration={0}>
        <motion.div 
          className={cn(
            "hidden md:flex flex-col h-full border-r bg-sidebar/50 backdrop-blur-xl border-sidebar-border shadow-xl z-40 relative",
            // Em mobile, transformamos em um drawer fixo se aberto
            isMobileOpen ? "fixed inset-y-0 left-0 flex w-64 bg-background" : "hidden md:flex"
          )}
          initial="expanded"
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={sidebarVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header / Logo */}
          <div className="flex h-20 items-center px-4 overflow-hidden border-b border-sidebar-border/50">
            <Link href="/admin" className="flex items-center gap-3 font-bold text-xl text-primary overflow-hidden whitespace-nowrap">
              <div className="flex items-center justify-center min-w-[2.5rem] h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-purple-400 text-white shadow-lg shadow-primary/20">
                <BookOpen className="h-6 w-6" />
              </div>
              <motion.span 
                animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
              >
                ClickAulas
              </motion.span>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-thin">
            {filteredItems.map((item, index) => {
              const isActive = pathname === item.href
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 group relative overflow-hidden",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {/* Efeito de brilho no hover para itens inativos */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-sidebar-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}

                      <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                      
                      <motion.span 
                        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.title}
                      </motion.span>

                      {/* Indicador Ativo (Pequena barra lateral) */}
                      {isActive && !isCollapsed && (
                        <motion.div layoutId="active-pill" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/50" />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-primary text-white border-0 font-medium">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>

          {/* Footer User Profile */}
          <div className="border-t border-sidebar-border/50 p-3">
            <div className={cn(
              "flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-2 border border-sidebar-border overflow-hidden transition-all",
              isCollapsed ? "justify-center bg-transparent border-0" : ""
            )}>
              <Avatar className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold">
                  {session?.user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <motion.div 
                animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-sm font-semibold truncate text-sidebar-foreground">{session?.user?.name}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{userRole}</span>
              </motion.div>

              <motion.div animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }} className="ml-auto">
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                 </Button>
              </motion.div>
            </div>
          </div>

          {/* Collapse Toggle Button */}
          <div className="absolute -right-3 top-24 hidden md:flex">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-6 w-6 rounded-full bg-background border-sidebar-border shadow-md hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
          </div>
        </motion.div>
      </TooltipProvider>

      {/* Overlay para Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}