import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { ScheduleForm } from "@/components/admin/schedule-form"

export default async function SchedulePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; class?: string }> 
}) {
  const session = await auth()
  
  // 1. Buscamos professores (apenas id/nome para o select)
  const teachers = await prisma.user.findMany({ 
    where: { role: "TEACHER" },
    select: { id: true, name: true }
  })

  // 2. Buscamos as SALAS para o select do formulário
  const rooms = await prisma.room.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  const params = await searchParams
  const query = params.q || ""
  const classFilter = params.class || "all"

  // 3. Buscamos as Aulas INCLUINDO a relação com 'room'
  const schedules = await prisma.classSchedule.findMany({
    where: {
      subject: { contains: query, mode: "insensitive" },
      ...(classFilter !== "all" ? { className: classFilter } : {})
    },
    include: { 
      teacher: true, 
      room: true // <--- CORREÇÃO: Necessário para acessar o nome da sala
    },
    orderBy: { startTime: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agenda de Aulas</h1>
        {/* Passamos teachers e rooms para o formulário */}
        <ScheduleForm teachers={teachers} rooms={rooms} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end bg-white p-4 rounded-lg border">
        <div className="w-full md:w-1/3">
           <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input name="q" placeholder="Pesquisar..." className="pl-8" defaultValue={query} />
            {classFilter !== 'all' && <input type="hidden" name="class" value={classFilter} />}
           </form>
        </div>
        
        <div className="flex gap-2">
           <a href="/admin/schedule?class=all" className={`px-4 py-2 text-sm rounded border ${classFilter === 'all' ? 'bg-primary text-white' : 'bg-slate-100'}`}>Todas</a>
           <a href="/admin/schedule?class=Turma A" className={`px-4 py-2 text-sm rounded border ${classFilter === 'Turma A' ? 'bg-primary text-white' : 'bg-slate-100'}`}>Turma A</a>
           <a href="/admin/schedule?class=Turma B" className={`px-4 py-2 text-sm rounded border ${classFilter === 'Turma B' ? 'bg-primary text-white' : 'bg-slate-100'}`}>Turma B</a>
        </div>
        
        <div className="w-[180px]">
           <Select disabled>
             <SelectTrigger><SelectValue placeholder="Salas: (Use a busca)" /></SelectTrigger>
           </Select>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Disciplina / Professor</TableHead>
              <TableHead>Conflitos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-blue-600 font-medium">
                  {formatDate(item.startTime, true)}
                </TableCell>
                <TableCell>{formatDate(item.endTime, true)}</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                    {item.className}
                  </span>
                </TableCell>
                <TableCell>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                    {/* CORREÇÃO: Acessamos item.room.name */}
                    {item.room.name}
                  </span>
                </TableCell>
                <TableCell>
                    <div className="font-semibold">{item.subject}</div>
                    <div className="text-xs text-muted-foreground">{item.teacher.name}</div>
                </TableCell>
                <TableCell>
                   {item.hasConflict ? (
                     <span className="text-red-600 font-bold flex items-center gap-1">Sim ⚠️</span>
                   ) : (
                     <span className="text-slate-500">Não</span>
                   )}
                </TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Nenhuma aula agendada.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}