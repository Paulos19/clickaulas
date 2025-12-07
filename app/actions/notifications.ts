"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const notificationSchema = z.object({
  userId: z.string().min(1, "Selecione um usuário"),
  type: z.string().min(1, "Tipo obrigatório"),
  message: z.string().min(1, "Mensagem obrigatória"),
  classScheduleId: z.string().optional(),
  isRead: z.string().optional(),
})

export async function createNotification(formData: FormData) {
  const session = await auth()
  // Todos podem criar notificações
  if (!session || !["ADMIN", "COORDINATOR", "TEACHER"].includes(session.user.role)) {
    return { error: "Não autorizado" }
  }

  const rawData = Object.fromEntries(formData.entries())
  const validated = notificationSchema.safeParse(rawData)

  if (!validated.success) return { error: "Dados inválidos" }

  const { userId, type, message, classScheduleId, isRead } = validated.data

  await prisma.notification.create({
    data: {
      userId, type, message,
      isRead: isRead === "on",
      classScheduleId: classScheduleId && classScheduleId !== "none" ? classScheduleId : null,
    }
  })

  revalidatePath("/admin/notifications")
  return { success: true }
}