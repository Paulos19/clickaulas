import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DashboardView } from "@/components/admin/dashboard-view"

async function getDashboardData() {
  // 1. Contagens Gerais
  const [totalClasses, totalTeachers, totalCoordinators, totalRooms] = await Promise.all([
    prisma.classSchedule.count(),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: "COORDINATOR" } }),
    prisma.room.count(),
  ])

  // 2. Dados do Gráfico (Aulas da semana atual agrupadas por dia)
  // Calculamos o intervalo da semana atual (Domingo a Sábado)
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Domingo
  
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  const classesThisWeek = await prisma.classSchedule.findMany({
    where: {
      startTime: {
        gte: startOfWeek,
        lte: endOfWeek
      }
    },
    select: { startTime: true }
  })

  // Mapeamento para o formato do Recharts
  const daysMap = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const chartDataInitial = daysMap.map(day => ({ day, count: 0 }))

  classesThisWeek.forEach(c => {
    const dayIndex = c.startTime.getDay()
    chartDataInitial[dayIndex].count++
  })

  // Reordenar para começar na Segunda (Opcional, padrão brasileiro útil)
  const chartData = [
    chartDataInitial[1],
    chartDataInitial[2],
    chartDataInitial[3],
    chartDataInitial[4],
    chartDataInitial[5],
    chartDataInitial[6],
    chartDataInitial[0],
  ]

  // 3. Notificações Recentes
  const recentNotifications = await prisma.notification.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } }
  })

  return {
    stats: {
      classes: totalClasses,
      teachers: totalTeachers,
      coordinators: totalCoordinators,
      rooms: totalRooms
    },
    chartData,
    notifications: recentNotifications
  }
}

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  const data = await getDashboardData()

  return (
    <DashboardView 
      userName={session.user?.name?.split(" ")[0] || "Usuário"} 
      stats={data.stats}
      chartData={data.chartData}
      notifications={data.notifications}
    />
  )
}