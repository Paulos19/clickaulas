import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { TeacherForm } from "@/components/admin/teacher-form"
import { DeleteTeacherButton } from "@/components/admin/delete-teacher-button"

export default async function TeachersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; inst?: string }> 
}) {
  const session = await auth()
  
  // Buscamos instituições para passar ao FORM
  const institutions = await prisma.institution.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  const { q, inst } = await searchParams
  const query = q || ""
  // Filtro por ID agora, não por nome direto, se vier da URL. 
  // Mas para simplificar a busca textual, filtramos no banco.
  
  const teachers = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      name: { contains: query, mode: "insensitive" },
      // Se tiver filtro de instituição (pelo ID ou Nome)
      ...(inst && inst !== "all" ? { institution: { name: inst } } : {}) 
    },
    include: { 
      institution: true // <--- CORREÇÃO: Incluir relação
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Professores</h1>
        {/* Passamos institutions para o modal */}
        <TeacherForm institutions={institutions} /> 
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <form className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input name="q" placeholder="Pesquisar..." className="pl-8" defaultValue={query} />
        </form>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome / Email</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Contratação</TableHead>
              <TableHead>Hora Aula</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={teacher.image || ""} />
                    <AvatarFallback>{teacher.name?.[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{teacher.name}</div>
                  <div className="text-xs text-muted-foreground">{teacher.email}</div>
                </TableCell>
                <TableCell>
                    {/* CORREÇÃO: Acessar nome da relação */}
                    {teacher.institution?.name || "-"}
                </TableCell>
                <TableCell>
                   <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-green-100 text-green-800">
                      {teacher.department}
                   </span>
                </TableCell>
                <TableCell>{teacher.phone || "-"}</TableCell>
                <TableCell>{formatDate(teacher.hiringDate)}</TableCell>
                <TableCell>{formatCurrency(teacher.hourlyRate?.toString())}</TableCell>
                <TableCell className="text-right space-x-2">
                    <TeacherForm 
                        teacher={{
                            ...teacher,
                            hourlyRate: teacher.hourlyRate ? Number(teacher.hourlyRate) : null,
                        }}
                        institutions={institutions} // Passando lista para edição
                    />
                    <DeleteTeacherButton id={teacher.id} />
                </TableCell>
              </TableRow>
            ))}
            {teachers.length === 0 && (
                <TableRow><TableCell colSpan={8} className="h-24 text-center">Nenhum professor encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}