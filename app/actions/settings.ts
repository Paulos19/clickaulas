"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const institutionSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  address: z.string().optional(),
})

const roomSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  capacity: z.coerce.number().optional(),
})

// Middleware check helper
async function checkAdmin() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("Acesso negado. Apenas Administradores.")
}

export async function createInstitution(formData: FormData) {
  try {
    await checkAdmin()
    const data = Object.fromEntries(formData.entries())
    const validated = institutionSchema.safeParse(data)
    if (!validated.success) return { error: "Dados inválidos" }

    await prisma.institution.create({ data: validated.data })
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (e: any) {
    return { error: e.message || "Erro ao criar instituição." }
  }
}

export async function deleteInstitution(id: string) {
  try {
    await checkAdmin()
    await prisma.institution.delete({ where: { id } })
    revalidatePath("/admin/settings")
  } catch (e: any) {
    return { error: "Não é possível excluir. Existem vínculos." }
  }
}

export async function createRoom(formData: FormData) {
  try {
    await checkAdmin()
    const data = Object.fromEntries(formData.entries())
    const validated = roomSchema.safeParse(data)
    if (!validated.success) return { error: "Dados inválidos" }

    await prisma.room.create({ data: validated.data })
    revalidatePath("/admin/settings")
    return { success: true }
  } catch (e: any) {
    return { error: e.message || "Erro ao criar sala." }
  }
}

export async function deleteRoom(id: string) {
  try {
    await checkAdmin()
    await prisma.room.delete({ where: { id } })
    revalidatePath("/admin/settings")
  } catch (e: any) {
    return { error: "Não é possível excluir. Existem aulas vinculadas." }
  }
}