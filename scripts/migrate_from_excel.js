const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_final.xlsx';
const CONTENT_DIR = path.join(__dirname, '../content/topics');

const SHEET_TO_FILE = {
  'Self-Discipline':    'self-discipline.json',
  'Intensity':          'intensity.json',
  'Practice':           'practice.json',
  'Dhyana & Samadhi':   'dhyana-samadhi.json',
  'Knowledge':          'knowledge.json',
  'Yoga':               'yoga.json',
  'Consciousness':      'consciousness.json',
  '8 Limbs of yoga':    '8-limbs.json',
  'Yama':               'yama.json',
  'Niyama':             'niyama.json',
  'Asana':              'asana.json',
  'Pranayama':          'pranayama.json',
  'Pratyahara':         'pratyahara.json',
  'Dharana':            'dharana.json',
  'Attachment':         'attachment.json',
  'Impressions&karma':  'impressions-karma.json',
  'Ignorance&suffering':'ignorance-suffering.json',
  'Samyama':            'samyama.json',
};

function clean(val) {
  if (val === undefined || val === null) return '';
  return String(val).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

function cleanSutraNumber(val) {
  if (!val) return '';
  return String(val)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .join(', ');
}

function cleanSanskrit(val) {
  if (!val) return '';
  return String(val)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .join('\n');
}

const wb = XLSX.readFile(EXCEL_PATH);

for (const [sheetName, fileName] of Object.entries(SHEET_TO_FILE)) {
  const ws = wb.Sheets[sheetName];
  if (!ws) { console.warn(`Sheet not found: ${sheetName}`); continue; }

  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const dataRows = rows.slice(1).filter(r => r[0] !== undefined && r[0] !== '');

  const filePath = path.join(CONTENT_DIR, fileName);
  if (!fs.existsSync(filePath)) { console.warn(`JSON not found: ${fileName}`); continue; }

  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const sections = dataRows.map((row, i) => {
    const sutraNum = cleanSutraNumber(row[0]);
    return {
      section: i + 1,
      theme: clean(row[1]),
      sutra: {
        number: sutraNum,
        sanskrit: cleanSanskrit(row[2]),
        transliteration: sutraNum ? `Sutra ${sutraNum}` : '',
        meaning: clean(row[3]),
      },
      insight: clean(row[4]),
      reflectionPrompt: clean(row[5]),
      practice: clean(row[6]),
      meditation: clean(row[7]),
      journalPrompt: clean(row[8]),
      whatOthersSaid: '',
      shlokaFrom: clean(row[9]),
      wisdomFrom: clean(row[10]),
    };
  });

  const updated = {
    ...existing,
    totalSections: sections.length,
    sections,
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`✓ ${fileName}: ${sections.length} sections`);
}

console.log('\nDone.');
