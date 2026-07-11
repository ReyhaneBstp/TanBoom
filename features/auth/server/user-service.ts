import bcryptjs from "bcryptjs"; 
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/features/auth/lib/validations";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
}

export async function createUser(data: RegisterInput) {
  const hashedPassword = await bcryptjs.hash(data.password, 12);

  return prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}