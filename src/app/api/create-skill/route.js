export const runtime = "nodejs";

import { prisma } from "../../../lib/prisma.js";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple text extraction - just read as text for now
async function extractTextFromFile(buffer) {
  // For PDFs, we'll return a placeholder since pdf parsing is complex
  // In production, you'd use a proper PDF parser
  return buffer.toString("utf-8").substring(0, 5000);
}

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromFile(buffer);

    const prompt = `
Extract the skills from the following text and return them as a JSON array of strings.
Only return valid JSON array format like: ["skill1", "skill2", "skill3"]

Text:
${text}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    
    // Clean response - remove markdown code blocks
    response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let skills;
    try {
      skills = JSON.parse(response);
    } catch (e) {
      console.error("JSON parse error:", e);
      return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const skillCreated = await prisma.skills.create({
      data: {
        name: "Extracted Skills",
        skills: Array.isArray(skills) ? skills : [skills],
        authorId: userId,
      },
    });

    return Response.json({ 
      success: true,
      data: skillCreated 
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
