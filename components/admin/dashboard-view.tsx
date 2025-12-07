"use client"

import { motion } from "framer-motion"
import { 
  CalendarDays, BookOpen, Users, Building2, ArrowUpRight, BellRing 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScheduleChart } from "@/components/admin/schedule-chart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface DashboardViewProps {
  userName: string;
  stats: {
    classes: number;
    teachers: number;
    coordinators: number;
    rooms: number;
  };
  chartData: { day: string; count: number }[];
  notifications: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export function DashboardView({ userName, stats, chartData, notifications }: DashboardViewProps) {
  
  const statCards = [
    { title: "Total de Aulas", value: stats.classes, icon: CalendarDays, label: "Agendadas no sistema" },
    { title: "Professores", value: stats.teachers, icon: BookOpen, label: "Cadastrados ativos" },
    { title: "Coordenadores", value: stats.coordinators, icon: Users, label: "Gestão escolar" },
    { title: "Salas de Aula", value: stats.rooms, icon: Building2, label: "Disponíveis" },
  ]

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Banner de Boas-vindas */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-8 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Olá, {userName}! 👋</h1>
            <p className="mt-2 text-primary-foreground/90 max-w-lg text-lg">
              Bem-vindo ao painel do ClickAulas. Você tem {stats.classes} aulas cadastradas no total.
            </p>
          </div>
          <Link href="/admin/schedule">
            <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
              Ver Agenda <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
      </motion.div>
      
      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-lg ring-1 ring-black/5 dark:ring-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</div>
                <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center">
                  {stat.label}
                </p>
              </CardContent>
              <div className="h-1 w-full bg-gradient-to-r from-primary/40 to-transparent mt-4" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Gráfico e Notificações */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="col-span-4 lg:col-span-5 h-full">
            <ScheduleChart data={chartData} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="col-span-4 lg:col-span-2 flex flex-col h-full">
           <Card className="h-full bg-gradient-to-b from-white/80 to-purple-50/50 flex flex-col">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <BellRing className="h-5 w-5 text-primary" />
                 Últimos Avisos
               </CardTitle>
             </CardHeader>
             <CardContent className="flex-1 overflow-auto max-h-[400px]">
               <div className="space-y-4">
                 {notifications.length === 0 ? (
                   <p className="text-sm text-muted-foreground text-center py-4">Nenhuma notificação recente.</p>
                 ) : (
                   notifications.map((notif) => (
                     <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/60 hover:bg-white transition-colors border border-transparent hover:border-primary/10 cursor-pointer">
                       <div className={`h-2 w-2 mt-1.5 shrink-0 rounded-full ${notif.isRead ? 'bg-slate-300' : 'bg-red-400 animate-pulse'}`} />
                       <div className="text-sm w-full">
                         <p className="font-medium text-slate-700">{notif.type}</p>
                         <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                         <p className="text-[10px] text-primary/60 mt-1 text-right">{formatDate(notif.createdAt)}</p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
             </CardContent>
           </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}