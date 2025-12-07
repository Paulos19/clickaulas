"use client"

import { useState } from "react"
import { upsertCoordinator } from "@/app/actions/coordinators"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Pencil, Loader2 } from "lucide-react"

// Interface atualizada para aceitar institutions
interface CoordinatorFormProps {
  coordinator?: any;
  institutions: { id: string; name: string }[];
}

export function CoordinatorForm({ coordinator, institutions }: CoordinatorFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPass, setGeneratedPass] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setGeneratedPass(null)
    
    const formData = new FormData(event.currentTarget)
    if (coordinator?.id) formData.append("id", coordinator.id)

    const result = await upsertCoordinator(null, formData)
    setIsLoading(false)
    
    if (result?.success) {
      if (result.createdPassword) {
        setGeneratedPass(result.createdPassword)
      } else {
        setOpen(false)
      }
    } else {
      alert(result?.error)
    }
  }

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) setGeneratedPass(null)
  }

  const isEditing = !!coordinator

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEditing ? (
            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        ) : (
            <Button><Plus className="mr-2 h-4 w-4" /> Adicionar Coordenador</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isEditing ? "Editar" : "Novo"} Coordenador</DialogTitle></DialogHeader>
        
        {generatedPass ? (
            <div className="space-y-4 py-4">
                <Alert className="bg-green-50 border-green-200">
                    <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Coordenador criado. Copie a senha abaixo agora:
                    </AlertDescription>
                </Alert>
                <div className="p-4 bg-slate-100 rounded border text-center">
                    <span className="text-2xl font-mono font-bold tracking-wider select-all">{generatedPass}</span>
                </div>
                <Button onClick={() => setOpen(false)} className="w-full">Fechar</Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Nome</Label>
                    <Input name="name" defaultValue={coordinator?.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Email</Label>
                    <Input name="email" type="email" defaultValue={coordinator?.email} className="col-span-3" required />
                </div>
                
                {/* SELECT DE INSTITUIÇÕES (Substituindo o Input antigo) */}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Instituição</Label>
                    <Select name="institutionId" defaultValue={coordinator?.institutionId || ""} required>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            {institutions.map(i => (
                                <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Depto.</Label>
                    <Input name="department" defaultValue={coordinator?.department} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Celular</Label>
                    <Input name="phone" defaultValue={coordinator?.phone} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Início</Label>
                    <Input name="hiringDate" type="date" defaultValue={coordinator?.hiringDate ? new Date(coordinator.hiringDate).toISOString().split('T')[0] : ""} className="col-span-3" />
                </div>
                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
                    </Button>
                </div>
            </form>
        )}
      </DialogContent>
    </Dialog>
  )
}