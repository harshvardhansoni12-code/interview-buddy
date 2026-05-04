export default function SkillsPage() {
  const [data, setData] = useState(null);
  const handleSubmit = async () => {
    const response = await fetch("/api/create-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Skills</h1>
      <p className="text-gray-600 mb-6">
        Upload a PDF document to extract skills and create a skill profile.
      </p>
      <div>input box</div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        submit
      </button>
    </div>
  );
}
