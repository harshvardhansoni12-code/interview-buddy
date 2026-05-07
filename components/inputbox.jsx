"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
export const InputBox = () => {
  const Router = useRouter();
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const DesktopClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdf(file);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!pdf) {
      setError("Please select a PDF file first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", pdf);
      
      const response = await fetch("/api/create-skill", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to submit. Please try again.");
        return;
      }
      Router.push("/skills");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="relative flex-1 min-w-0">
        <Input
          readOnly
          type="text"
          placeholder="Select a PDF document to begin..."
          value={pdf ? pdf.name : ""}
          onClick={DesktopClick}
          className="w-full h-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 cursor-pointer truncate text-base font-medium"
        />
        <input
          ref={fileRef}
          onChange={handleFileChange}
          type="file"
          accept=".pdf"
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 px-1">{error}</p>
      )}
      <Button
        className="h-12 px-6 rounded-xl text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 font-semibold"
        onClick={DesktopClick}
        disabled={loading}
      >
        {pdf ? "Change" : "Browse"}
      </Button>
      <Button
        className="h-12 px-6 my-1 rounded-xl text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 font-semibold"
        type="button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </Button>
    </div>
  );
};
