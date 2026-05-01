const XLSX = require('xlsx');
const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';

const workbook = XLSX.readFile(filePath);

const topicConfig = {
    'Yoga': { slug: 'yoga' },
    'Self-Discipline': { slug: 'self-discipline' },
    'Practice': { slug: 'practice' },
    '8-limbs': { slug: '8-limbs' },
    'Yama': { slug: 'yama' },
    'Niyama': { slug: 'niyama' },
    'Asana': { slug: 'asana' },
    'Pranayama': { slug: 'pranayama' },
    'Pratyahara': { slug: 'pratyahara' },
    'Dharana': { slug: 'dharana' },
    'Dhyana': { slug: 'dhyana' },
    'Attachment': { slug: 'attachment' },
    'Impressions-Karma': { slug: 'impressions-karma' },
    'Knowledge': { slug: 'knowledge' },
    'Consciousness': { slug: 'consciousness' },
    'Samyama': { slug: 'samyama' },
    'Dhyana-Samadhi': { slug: 'dhyana-samadhi' },
    'Ignorance-Suffering': { slug: 'ignorance-suffering' },
    'Intensity': { slug: 'intensity' },
    'Detachment': { slug: 'detachment' }
};

const phases = [
    'Awareness',
    'Exploration',
    'Deepening',
    'Integration',
    'Transformation',
    'Transcendence'
];

let updated = false;

workbook.SheetNames.forEach(sheetName => {
    if (!topicConfig[sheetName]) return;
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length === 0) return;

    const headers = data[0];
    const phaseIndex = headers.indexOf('Phase');
    
    if (phaseIndex === -1) {
        console.log(`Sheet "${sheetName}" is missing "Phase" column. Adding it.`);
        headers.splice(1, 0, 'Phase'); // Insert Phase as second column
        for (let i = 1; i < data.length; i++) {
            const phase = phases[(i - 1) % phases.length];
            data[i].splice(1, 0, phase);
        }
        updated = true;
    } else {
        // Check if values are missing
        for (let i = 1; i < data.length; i++) {
            if (!data[i][phaseIndex]) {
                data[i][phaseIndex] = phases[(i - 1) % phases.length];
                updated = true;
            }
        }
    }
    
    if (updated) {
        workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
    }
});

if (updated) {
    XLSX.writeFile(workbook, filePath);
    console.log('Excel file updated with missing Section Names (Phases).');
} else {
    console.log('All sheets already have Section Names (Phases).');
}
