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
      <input
        type="file"
        ref={fileRef}
        onClick={DesktopClick}
        onChange={handleFileChange}
        style={{ display: "none" }}
        className="bg-white p-1 rounded-3xl"
      />
      <button className="bg-blue-500 text-white p-2 rounded">
        Choose File
      </button>
    </div>
  );
};
