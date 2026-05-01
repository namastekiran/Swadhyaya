const XLSX = require("xlsx");
const path = require("path");

const EXCEL_PATH = path.resolve(
  process.env.USERPROFILE || process.env.HOME || "~",
  "Downloads/Swadhyaya_Content.xlsx"
);

try {
  const wb = XLSX.readFile(EXCEL_PATH);
  console.log("Sheet names found in the Excel file:");
  console.log(wb.SheetNames.map(name => `"${name}"`).join(", "));
} catch (e) {
  console.error("Error reading file:", e.message);
}
