export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { data } = await req.json();
    const prompt = `
  Generate a question and answer pair based on the following data in the form of json array which consist question and answer in the form of objects in which the elements are differ by their id :${data}
   `;
    // process the data and get the skills
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const { questionandanswer } = JSON.parse(response.text());
    const questionCreated = await prisma.questionAndAnswer.create({
      data: {
        questionandanswer: JSON.stringify({ questionandanswer }),
        skillId: data.skillId,
        userId: session.id,
      },
    });
    if (!questionCreated) {
      return new Response("Failed to create question and answer", {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ questionandanswer }), { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
