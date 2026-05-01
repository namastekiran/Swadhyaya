const XLSX = require('xlsx');
const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';

const workbook = XLSX.readFile(filePath);

workbook.SheetNames.forEach(sheetName => {
    if (sheetName === 'Brainstorming ideas' || sheetName === 'Sheet3') return;
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length > 0) {
        console.log(`\nSheet: ${sheetName}`);
        console.log('Headers:', data[0]);
        if (data[1]) console.log('Sample Row 1:', data[1]);
    }
});
