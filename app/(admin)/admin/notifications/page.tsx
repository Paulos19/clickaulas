import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { NotificationForm } from "@/components/admin/notification-form"

export default async function NotificationsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const session = await auth()

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true }
  })
  
  const classes = await prisma.classSchedule.findMany({
    select: { id: true, subject: true, className: true, startTime: true }
  })

  const params = await searchParams
  const query = params.q || ""

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { message: { contains: query, mode: "insensitive" } },
        { type: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } }
      ]
    },
    include: { 
      user: { select: { name: true, email: true } } // Include seguro
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Notificações</h1>
        {/* Passamos dados leves para o form */}
        <NotificationForm users={users} classes={classes} />
      </div>

      {/* Filtro de Busca  */}
      <div className="flex items-center bg-white p-4 rounded-lg border">
        <div className="w-full md:w-1/3">
           <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input name="q" placeholder="Pesquisar..." className="pl-8" defaultValue={query} />
           </form>
        </div>
      </div>

      {/* Tabela  */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{formatDate(item.createdAt, true)}</TableCell>
                <TableCell>
                    <div>{item.user.name}</div>
                    <div className="text-xs text-muted-foreground">{item.user.email}</div>
                </TableCell>
                <TableCell className="max-w-md truncate" title={item.message}>
                    {item.message}
                </TableCell>
                <TableCell>
                   {item.isRead ? (
                     <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Lida</Badge>
                   ) : (
                     <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Não Lida</Badge>
                   )}
                </TableCell>
              </TableRow>
            ))}
            {notifications.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhuma notificação encontrada.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}