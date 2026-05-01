const XLSX = require('xlsx');
const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';

const workbook = XLSX.readFile(filePath);

function getSectionName(sutraStr) {
    if (!sutraStr) return "Awareness";
    
    const s = sutraStr.toString().toLowerCase();
    
    // Chapter 1: Samadhi Pada
    if (s.includes('1.') || s.includes('yogah chitta')) return "Awareness & Mind";
    
    // Chapter 2: Sadhana Pada
    if (s.includes('2.') || s.includes('yama') || s.includes('niyama') || s.includes('asana') || s.includes('prana')) return "Foundations & Practice";
    
    // Chapter 3: Vibhuti Pada
    if (s.includes('3.') || s.includes('dharana') || s.includes('dhyana') || s.includes('samadhi')) return "Integration & Focus";
    
    // Default fallback
    return "Self-Inquiry";
}

workbook.SheetNames.forEach(sheetName => {
    // Only process topic sheets (excluding brainstorm/meta sheets)
    if (sheetName.includes('Draft') || sheetName.includes('Workflow') || sheetName.includes('Sheet')) return;

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length < 2) return;

    const headers = data[0];
    let phaseIndex = headers.indexOf('Phase');
    let sectionNameIndex = headers.indexOf('Section Name');
    let sutraIndex = headers.indexOf('Sutra') !== -1 ? headers.indexOf('Sutra') : headers.indexOf('Sutra / Concept');

    // Use existing column or create "Section Name"
    let targetIndex = sectionNameIndex !== -1 ? sectionNameIndex : (phaseIndex !== -1 ? phaseIndex : -1);

    if (targetIndex === -1) {
        headers.splice(1, 0, 'Section Name');
        targetIndex = 1;
        for (let i = 1; i < data.length; i++) {
            data[i].splice(1, 0, '');
        }
        if (sutraIndex !== -1 && sutraIndex >= 1) sutraIndex++; // Shift sutra index if we inserted before it
    }

    // Fill empty section names
    for (let i = 1; i < data.length; i++) {
        // Only fill if it's currently empty
        if (!data[i][targetIndex] || data[i][targetIndex].toString().trim() === "") {
            const sutraVal = sutraIndex !== -1 ? data[i][sutraIndex] : "";
            data[i][targetIndex] = getSectionName(sutraVal);
        }
    }
    
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
});

XLSX.writeFile(workbook, filePath);
console.log('Successfully filled missing Section Names based on Sutras in Swadhyaya_Content.xlsx.');
