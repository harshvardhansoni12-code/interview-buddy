import { prisma } from "../../../lib/prisma.js";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractTextFromPDF } from "../../../lib/pdf-utils-server.js";

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return Response.json(
        { error: "Invalid Content-Type. Expected 'multipart/form-data'." },
        { status: 400 },
      );
    }

    const session = await getServerSession();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id ?? session.user.email;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPDF(buffer);

    if (!text || typeof text !== "string" || text.trim() === "") {
      return Response.json({ error: "Failed to extract text from PDF" }, { status: 400 });
    }

    const prompt = `
Extract the skills from the following text and return them as a JSON array of strings.
Only return valid JSON array format like: ["skill1", "skill2", "skill3"]

Text:
${text}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // Clean response - remove markdown code blocks
    response = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let skills;
    try {
      skills = JSON.parse(response);
    } catch (e) {
      console.error("JSON parse error:", e);
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    console.log("Extracted skills:", skills);
    console.log("Available prisma models:", Object.keys(prisma));

    const skillCreated = await prisma.skills.create({
      data: {
        name: "Extracted Skills",
        skills: Array.isArray(skills) ? skills : [skills],
        authorId: userId,
      },
    });

    return Response.json({
      success: true,
      data: skillCreated,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
