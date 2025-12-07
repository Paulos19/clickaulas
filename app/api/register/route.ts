import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // LÓGICA MÁGICA 2: Verificação do Admin no registro manual
    const role = email === process.env.EMAIL_ADMIN ? "ADMIN" : "TEACHER";

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role, // Define Admin se bater com o .env
      },
    });

    return NextResponse.json({ user: { email: user.email, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao registrar" }, { status: 500 });
  }
}