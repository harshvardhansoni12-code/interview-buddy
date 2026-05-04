import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { text } = await req.json();
    const prompt = `
  Extract the skills from the following text and return them as a JSON array:
  ${text}`;
    // process the data and get the skills
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const skills = response.text();

    const skillCreated = await prisma.skills.create({
      data: {
        text: skills,
      },
      where: {
        id: session.id,
      },
    });
    if (!skillCreated) {
      return Response.json("Failed to create skill", { status: 500 });
    }
    return Response.json(skillCreated, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json("Internal Server Error", { status: 500 });
  }
}
