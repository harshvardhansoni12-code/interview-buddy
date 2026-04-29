"use client";

import { useRef, useState } from "react";

export const InputBox = () => {
  const [pdf, setPdf] = useState(null);
  const fileRef = useRef(null);
  const DesktopClick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdf(file);
    //
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
          className="w-full h-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-black dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 cursor-pointer truncate text-base font-medium"
        />
        <input
          ref={fileRef}
          onChange={handleFileChange}
          type="file"
          accept=".pdf"
          className="hidden"
        />
      </div>
      <Button
        className="h-12 px-6 rounded-xl text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 font-semibold"
        onClick={DesktopClick}
        type="button"
      >
        <Plus className="size-5 mr-1" />
        {pdf ? "Change" : "Browse"}
      </Button>
    </div>
  );
};
