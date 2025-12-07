import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createInstitution, deleteInstitution, createRoom, deleteRoom } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth() // Check de sessão implícito pelo layout

  const institutions = await prisma.institution.findMany({ orderBy: { name: 'asc' } })
  const rooms = await prisma.room.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>

      <Tabs defaultValue="institutions" className="w-full">
        <TabsList>
          <TabsTrigger value="institutions">Instituições</TabsTrigger>
          <TabsTrigger value="rooms">Salas de Aula</TabsTrigger>
        </TabsList>

        {/* --- ABA INSTITUIÇÕES --- */}
        <TabsContent value="institutions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar Instituição</CardTitle>
              <CardDescription>Adicione novas unidades de ensino.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createInstitution} className="flex gap-4 items-end">
                <div className="grid w-full items-center gap-1.5">
                    <Input name="name" placeholder="Nome (Ex: CEUB Asa Norte)" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Input name="address" placeholder="Endereço (Opcional)" />
                </div>
                <Button type="submit">Adicionar</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Endereço</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader>
                <TableBody>
                  {institutions.map((inst) => (
                    <TableRow key={inst.id}>
                      <TableCell>{inst.name}</TableCell>
                      <TableCell>{inst.address || "-"}</TableCell>
                      <TableCell className="text-right">
                        <form action={deleteInstitution.bind(null, inst.id)}>
                            <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4"/></Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ABA SALAS --- */}
        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar Sala</CardTitle>
              <CardDescription>Adicione salas disponíveis para agendamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createRoom} className="flex gap-4 items-end">
                <div className="grid w-full items-center gap-1.5">
                    <Input name="name" placeholder="Nome (Ex: Sala 101)" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Input name="capacity" type="number" placeholder="Capacidade" />
                </div>
                <Button type="submit">Adicionar</Button>
              </form>
            </CardContent>
          </Card>

           <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Capacidade</TableHead><TableHead className="text-right">Ação</TableHead></TableRow></TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>{room.capacity || "-"}</TableCell>
                      <TableCell className="text-right">
                        <form action={deleteRoom.bind(null, room.id)}>
                            <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4"/></Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}