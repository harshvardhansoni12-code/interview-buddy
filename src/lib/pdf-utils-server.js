// v2 - using pdf2json
import PDFParser from "pdf2json";

export const extractTextFromPDF = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData.Pages.map(page => 
        page.Texts.map(text => text.R.map(r => r.T).join(" ")).join(" ")
      ).join("\n");
      resolve(text);
    });
    
    pdfParser.on("pdfParser_dataError", (error) => {
      reject(error);
    });
    
    pdfParser.parseBuffer(fileBuffer);
  });
};
