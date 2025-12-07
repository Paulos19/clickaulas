import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CalendarDays, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScheduleChart } from "@/components/admin/schedule-chart"

// Função auxiliar para formatar dados para o gráfico (Mock ou Real)
async function getDashboardData() {
  // 1. Total de Aulas
  const totalClasses = await prisma.classSchedule.count()

  // 2. Agrupamento (Lógica simplificada para demonstração)
  // Em produção, isso seria uma query SQL raw ou aggregation
  const chartData = [
    { day: "Segunda", count: await prisma.classSchedule.count({ where: { startTime: { lte: new Date('2024-12-08'), gte: new Date('2024-12-02') } } }) || 12 },
    { day: "Terça", count: 19 },
    { day: "Quarta", count: 15 },
    { day: "Quinta", count: 22 },
    { day: "Sexta", count: 10 },
    { day: "Sábado", count: 5 },
  ]

  return { totalClasses, chartData }
}

export default async function AdminDashboard() {
  const session = await auth()
  const { totalClasses, chartData } = await getDashboardData()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      {/* Cards de Métricas Superiores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total de Aulas (Conforme Fonte 24) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Aulas Agendadas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses > 0 ? totalClasses : 0}</div>
            <p className="text-xs text-muted-foreground">
              Número total de aulas no sistema
            </p>
          </CardContent>
        </Card>

        {/* Card Extra: Total de Professores (Boa prática para admin) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Professores Ativos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
               {await prisma.user.count({ where: { role: "TEACHER" } })}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastrados na plataforma
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção do Gráfico */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-7">
            {/* Componente Gráfico importado */}
            <ScheduleChart data={chartData} />
        </div>
      </div>
    </div>
  )
}