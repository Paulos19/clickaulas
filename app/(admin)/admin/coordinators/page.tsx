import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { CoordinatorForm } from "@/components/admin/coordinator-form"
import { DeleteCoordinatorButton } from "@/components/admin/delete-coordinator-button"

export default async function CoordinatorsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; inst?: string }> 
}) {
  const session = await auth()

  const institutions = await prisma.institution.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  const { q, inst } = await searchParams
  const query = q || ""
  const institutionFilter = inst || "all"
  const coordinators = await prisma.user.findMany({
    where: {
      role: "COORDINATOR",
      name: { contains: query, mode: "insensitive" },
      ...(institutionFilter !== "all" ? { institution: { name: institutionFilter } } : {})
    },
    include: {
      institution: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Coordenadores</h1>
        <CoordinatorForm institutions={institutions} /> 
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <form className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input name="q" placeholder="Pesquisar..." className="pl-8" defaultValue={query} />
          {institutionFilter !== 'all' && <input type="hidden" name="inst" value={institutionFilter} />}
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <div className="bg-muted p-1 rounded-md flex gap-1">
                <a href="/admin/coordinators?inst=all" className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-sm ${institutionFilter === 'all' ? 'bg-background shadow' : ''}`}>Todas</a>
                {institutions.map(i => (
                  <a 
                    key={i.id} 
                    href={`/admin/coordinators?inst=${encodeURIComponent(i.name)}`} 
                    className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-sm ${institutionFilter === i.name ? 'bg-background shadow' : ''}`}
                  >
                    {i.name}
                  </a>
                ))}
            </div>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto do perfil</TableHead>
              <TableHead>Nome / Email</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Contratação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coordinators.map((coord) => (
              <TableRow key={coord.id}>
                <TableCell>
                  <Avatar>
                      <AvatarImage src={coord.image || ""} />
                      <AvatarFallback>{coord.name?.[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{coord.name}</span>
                        <span className="text-xs text-muted-foreground">{coord.email}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-medium">
                        {coord.institution?.name || "-"}
                    </span>
                </TableCell>
                <TableCell>{coord.department}</TableCell>
                <TableCell>{coord.phone || "-"}</TableCell>
                <TableCell>{formatDate(coord.hiringDate)}</TableCell>
                <TableCell className="text-right space-x-2">
                    <CoordinatorForm coordinator={coord} institutions={institutions} />
                    <DeleteCoordinatorButton id={coord.id} />
                </TableCell>
              </TableRow>
            ))}
            {coordinators.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center h-24">Nenhum coordenador encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}