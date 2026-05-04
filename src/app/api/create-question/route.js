export async function POST(req) {
  const { data } = await req.json();
  console.log("Received data in create-question API route:", data);
}
