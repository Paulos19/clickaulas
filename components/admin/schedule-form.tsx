"use client"
import { useState } from "react"
import { createClassSchedule } from "@/app/actions/schedule"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScheduleFormProps {
  teachers: { id: string; name: string | null }[];
  rooms: { id: string; name: string }[]; // Nova prop obrigatória
}

export function ScheduleForm({ teachers, rooms }: ScheduleFormProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const res = await createClassSchedule(formData)
    if (res?.success) setOpen(false)
    else alert(res?.error)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cadastrar Aula</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Novo Horário de Aula</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
            
            <div className="space-y-2">
                <Label>Turma</Label>
                <Select name="className" required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Turma A">Turma A</SelectItem>
                        <SelectItem value="Turma B">Turma B</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* SELECT DINÂMICO DE SALAS */}
            <div className="space-y-2">
                <Label>Sala</Label>
                <Select name="roomId" required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                        {rooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Professor</Label>
                <Select name="teacherId" required>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                        {teachers.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Matéria</Label>
                <Input name="subject" placeholder="Ex: Engenharia de Software" required />
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label>Data</Label>
                    <Input type="date" name="date" required />
                 </div>
                 <div className="space-y-2">
                    <Label>Início</Label>
                    <Input type="time" name="startTime" required />
                 </div>
                 <div className="space-y-2">
                    <Label>Fim</Label>
                    <Input type="time" name="endTime" required />
                 </div>
            </div>

            <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}