const XLSX = require('xlsx');
const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);
    
    // Check the first few rows of each sheet to understand the structure
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(`\n--- Sheet: ${sheetName} ---`);
        console.log('First 2 rows:', data.slice(0, 2));
    });
} catch (error) {
    console.error('Error reading excel file:', error.message);
}
