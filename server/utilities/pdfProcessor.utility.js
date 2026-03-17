const fs = require("fs");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);

  // pdf-parse outputs everything merged, but it keeps page breaks as '\f'
  const pages = data.text.split(/\f/);

  return pages.map((pageText, idx) => ({
    page: idx + 1,
    text: pageText.trim()
  }));
};

module.exports = { extractTextFromPDF };
