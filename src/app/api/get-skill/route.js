export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { text } = await req.json();
  // process the data and get the skills
  const skillCreated = await prisma.skill.create({
    data: {
      text: text,
    },
    where: {
      id: session.id,
    },
  });
  if (!skillCreated) {
    return new Response("Failed to create skill", { status: 500 });
  }
}
