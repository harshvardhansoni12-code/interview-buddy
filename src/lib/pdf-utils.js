"use client";

let pdfjs;
if (typeof window !== "undefined") {
  pdfjs = require("react-pdf").pdfjs;
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
}

export const extractTextFromPDF = async (file) => {
  try {
    if (!pdfjs) {
      throw new Error("PDF.js is not available in the current environment.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};
