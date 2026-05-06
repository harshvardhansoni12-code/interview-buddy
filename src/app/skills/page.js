"use client";

import { useState } from "react";

export default function SkillsPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/create-skill", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the file.");
      }

      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Skills</h1>
      <p className="text-gray-600 mb-6">
        Upload a PDF document to extract skills and create a skill profile.
      </p>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">File submitted successfully!</p>}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}
