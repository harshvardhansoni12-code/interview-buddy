import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { email, password } = await request.json();

  const userFound = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!userFound) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCreated = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  if (!userCreated) {
    return new Response(JSON.stringify({ message: "Error creating user" }), {
      status: 500,
    });
  }
  return Response.json({ message: "user created" }, { status: 201 });
}
