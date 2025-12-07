"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateRandomPassword } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { z } from "zod"

const teacherSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  institutionId: z.string().min(1, "Instituição obrigatória"),
  department: z.string().min(1, "Departamento obrigatório"),
  phone: z.string().optional(),
  hourlyRate: z.coerce.number().min(0, "Valor inválido"),
  hiringDate: z.coerce.date().optional(),
})

export async function upsertTeacher(prevState: any, formData: FormData) {
  const session = await auth()
  const role = session?.user.role

  // RESTRIÇÃO DE SEGURANÇA: Admin ou Coordenador
  if (role !== "ADMIN" && role !== "COORDINATOR") {
    return { error: "Acesso negado. Você não tem permissão para gerenciar professores." }
  }

  const data = Object.fromEntries(formData.entries())
  const validated = teacherSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Dados inválidos", issues: validated.error.flatten() }
  }

  const { id, ...fields } = validated.data

  try {
    let createdPassword = null;

    if (id) {
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
          role: "TEACHER",
          image: "",
        }
      })
    }

    revalidatePath("/admin/teachers")
    return { success: true, createdPassword }
  } catch (error) {
    return { error: "Erro ao salvar professor. Email pode já existir." }
  }
}

export async function deleteTeacher(id: string) {
  const session = await auth()
  const role = session?.user.role

  // Admin ou Coordenador pode excluir
  if (role !== "ADMIN" && role !== "COORDINATOR") return { error: "Acesso negado." }

  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/teachers")
}