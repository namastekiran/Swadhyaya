const XLSX = require('xlsx');
const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';
const workbook = XLSX.readFile(filePath);
console.log(workbook.SheetNames);
