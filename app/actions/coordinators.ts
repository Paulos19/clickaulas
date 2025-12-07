"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateRandomPassword } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"

const coordinatorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  institutionId: z.string().min(1, "Instituição obrigatória"),
  department: z.string().min(1, "Departamento obrigatório"),
  phone: z.string().optional(),
  hiringDate: z.coerce.date().optional(),
})

export async function upsertCoordinator(prevState: any, formData: FormData) {
  const session = await auth()
  
  // RESTRIÇÃO DE SEGURANÇA: Apenas ADMIN cria coordenadores
  if (session?.user.role !== "ADMIN") {
    return { error: "Acesso negado. Apenas administradores podem gerenciar coordenadores." }
  }

  const data = Object.fromEntries(formData.entries())
  const validated = coordinatorSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Dados inválidos", issues: validated.error.flatten() }
  }

  const { id, ...fields } = validated.data

  try {
    let createdPassword = null;

    if (id) {
      // Edição
      await prisma.user.update({
        where: { id },
        data: fields
      })
    } else {
      // Criação: Gera Senha Aleatória
      createdPassword = generateRandomPassword()
      const hashedPassword = await bcrypt.hash(createdPassword, 10)

      await prisma.user.create({
        data: {
          ...fields,
          password: hashedPassword,
          role: "COORDINATOR",
          image: "",
        }
      })
    }

    revalidatePath("/admin/coordinators")
    // Retorna a senha para ser exibida no frontend (apenas na criação)
    return { success: true, createdPassword }
  } catch (error) {
    return { error: "Erro ao salvar. Verifique se o email já existe." }
  }
}

export async function deleteCoordinator(id: string) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") return { error: "Acesso negado." }

  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/coordinators")
}