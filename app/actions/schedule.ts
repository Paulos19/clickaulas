"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// ... (schema permanece igual) ...
const scheduleSchema = z.object({
  className: z.string().min(1, "Turma obrigatória"),
  roomId: z.string().min(1, "Sala obrigatória"),
  subject: z.string().min(1, "Matéria obrigatória"),
  teacherId: z.string().min(1, "Professor obrigatório"),
  date: z.string().min(1, "Data obrigatória"),
  startTime: z.string().min(1, "Início obrigatório"),
  endTime: z.string().min(1, "Fim obrigatório"),
})

export async function createClassSchedule(formData: FormData) {
  const session = await auth()
  // Permite Admin, Coordenador e Professor
  if (!session || !["ADMIN", "COORDINATOR", "TEACHER"].includes(session.user.role)) {
    return { error: "Não autorizado" }
  }

  const rawData = Object.fromEntries(formData.entries())
  const validated = scheduleSchema.safeParse(rawData)

  if (!validated.success) return { error: "Dados inválidos" }

  const { className, roomId, subject, teacherId, date, startTime, endTime } = validated.data
  const startDateTime = new Date(`${date}T${startTime}:00`)
  const endDateTime = new Date(`${date}T${endTime}:00`)

  if (endDateTime <= startDateTime) return { error: "Hora final deve ser maior que inicial" }

  const conflictCount = await prisma.classSchedule.count({
    where: {
      roomId: roomId,
      OR: [
        { startTime: { lte: startDateTime }, endTime: { gte: startDateTime } },
        { startTime: { lte: endDateTime }, endTime: { gte: endDateTime } }
      ]
    }
  })

  await prisma.classSchedule.create({
    data: {
      className, roomId, subject, startTime: startDateTime, endTime: endDateTime, teacherId,
      hasConflict: conflictCount > 0 
    }
  })

  revalidatePath("/admin/schedule")
  return { success: true }
}