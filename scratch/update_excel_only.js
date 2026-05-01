const XLSX = require('xlsx');
const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';

const workbook = XLSX.readFile(filePath);

const sectionNames = [
    "The Sacred Beginning",
    "Stilling the Mind",
    "Five Movements of Mind",
    "Practice & Letting Go"
];

const targetSheets = ['Self-Discipline', 'Practice', 'Yoga', 'Intensity']; // Adding a few common ones

workbook.SheetNames.forEach(sheetName => {
    // We check for topics that might need these names
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length < 2) return;

    const headers = data[0];
    let phaseIndex = headers.indexOf('Phase');
    let sectionNameIndex = headers.indexOf('Section Name');
    
    // Determine which column to use or add
    let targetIndex = sectionNameIndex !== -1 ? sectionNameIndex : (phaseIndex !== -1 ? phaseIndex : -1);

    if (targetIndex === -1) {
        // Add "Section Name" column if both are missing
        headers.splice(1, 0, 'Section Name');
        targetIndex = 1;
        for (let i = 1; i < data.length; i++) {
            data[i].splice(1, 0, '');
        }
    }

    // Fill in the names for the first 4 days
    for (let i = 1; i < data.length && i <= sectionNames.length; i++) {
        data[i][targetIndex] = sectionNames[i - 1];
    }
    
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
});

XLSX.writeFile(workbook, filePath);
console.log('Successfully updated Section Names in Swadhyaya_Content.xlsx for all topic sheets.');
