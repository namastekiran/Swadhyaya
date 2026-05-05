const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = 'C:/Users/Sheela Naik/Downloads/Swadhaya_v1.xlsx';
const CONTENT_DIR = path.join(__dirname, '../content/topics');

const SHEET_TO_FILE = {
  // Existing topics
  'Self-Discipline':              'self-discipline.json',
  'Intensity':                    'intensity.json',
  'Practice':                     'practice.json',
  'Dhyana & Samadhi':             'dhyana-samadhi.json',
  'Knowledge':                    'knowledge.json',
  'Yoga':                         'yoga.json',
  'Consciousness':                'consciousness.json',
  '8 Limbs of yoga':              '8-limbs.json',
  'Yama':                         'yama.json',
  'Niyama':                       'niyama.json',
  'Asana':                        'asana.json',
  'Pranayama':                    'pranayama.json',
  'Pratyahara':                   'pratyahara.json',
  'Dharana':                      'dharana.json',
  'Attachment':                   'attachment.json',
  'Impressions & Karma':          'impressions-karma.json',
  '5 Kleshas sufferings':         'ignorance-suffering.json',
  'Samyama':                      'samyama.json',
  // New topics
  'Obstacles and remedy':         'obstacles-remedy.json',
  'Who is God':                   'who-is-god.json',
  'Ahimsa':                       'ahimsa.json',
  'Satya':                        'satya.json',
  'Asteya nonstealing':           'asteya.json',
  'Brahmacharya':                 'brahmacharya.json',
  'Aparigraha':                   'aparigraha.json',
  'Iswarpranidhana surrender':    'iswarpranidhana.json',
  'Swadhyaya':                    'swadhyaya-niyama.json',
  'Tapas':                        'tapas.json',
  'Santosha':                     'santosha.json',
  'Shauch':                       'shauch.json',
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
  const headerRow = rows[0] || [];
  const dataRows = rows.slice(1).filter(r => r[0] !== undefined && r[0] !== '');

  // Find columns by header name
  function colIdx(keywords) {
    for (let i = 0; i < headerRow.length; i++) {
      const h = String(headerRow[i] || '').toLowerCase();
      if (keywords.some(k => h.includes(k.toLowerCase()))) return i;
    }
    return -1;
  }

  const CI = {
    sutraNo:    colIdx(['sutra no', 'sutra n']),
    theme:      colIdx(['theme', 'section name']),
    sanskrit:   colIdx(['sutra (sanskrit)', 'sanskrit']),
    meaning:    colIdx(['meaning']),
    insight:    colIdx(['deeper insight', 'insight']),
    gurudev:    colIdx(['deep dive with gurudev', 'deep dive']),
    reflection: colIdx(['reflection prompt', 'reflection']),
    practice:   colIdx(['practice']),
    meditation: colIdx(['meditation']),
    journal:    colIdx(['journal prompt', 'journal']),
    shloka:     colIdx(['shloka']),
    wisdom:     colIdx(['wisdom']),
  };

  // Fallback to positional if headers not found
  if (CI.sutraNo < 0) CI.sutraNo = 0;
  if (CI.theme < 0) CI.theme = 1;
  if (CI.sanskrit < 0) CI.sanskrit = 2;
  if (CI.meaning < 0) CI.meaning = 3;
  if (CI.insight < 0) CI.insight = 4;
  if (CI.reflection < 0) CI.reflection = CI.gurudev >= 0 ? 6 : 5;
  if (CI.practice < 0) CI.practice = CI.gurudev >= 0 ? 7 : 6;
  if (CI.meditation < 0) CI.meditation = CI.gurudev >= 0 ? 8 : 7;
  if (CI.journal < 0) CI.journal = CI.gurudev >= 0 ? 9 : 8;
  if (CI.shloka < 0) CI.shloka = CI.gurudev >= 0 ? 10 : 9;
  if (CI.wisdom < 0) CI.wisdom = CI.gurudev >= 0 ? 11 : 10;

  const filePath = path.join(CONTENT_DIR, fileName);

  const TOPIC_META = {
    'obstacles-remedy.json':   { id: 'obstacles-remedy',   title: 'Obstacles on the Path',      tagline: 'Nine distractions & their remedies',              icon: 'zap'       },
    'who-is-god.json':         { id: 'who-is-god',          title: 'Who Is God',                  tagline: 'The nature of the divine in yoga philosophy',      icon: 'orbit'     },
    'ahimsa.json':             { id: 'ahimsa',              title: 'Ahimsa',                      tagline: 'Non-violence — the highest ethical foundation',    icon: 'heart'     },
    'satya.json':              { id: 'satya',               title: 'Satya',                       tagline: 'Truthfulness — aligning thought, word, and deed',  icon: 'zap'       },
    'asteya.json':             { id: 'asteya',              title: 'Asteya',                      tagline: 'Non-stealing — living with integrity and trust',   icon: 'repeat'    },
    'brahmacharya.json':       { id: 'brahmacharya',        title: 'Brahmacharya',                tagline: 'Right use of energy for spiritual growth',         icon: 'flame'     },
    'aparigraha.json':         { id: 'aparigraha',          title: 'Aparigraha',                  tagline: 'Non-possessiveness — living with an open hand',    icon: 'wind'      },
    'iswarpranidhana.json':    { id: 'iswarpranidhana',     title: 'Ishwara Pranidhana',          tagline: 'Surrender to the divine — letting go into trust',  icon: 'moon'      },
    'swadhyaya-niyama.json':   { id: 'swadhyaya-niyama',   title: 'Swadhyaya',                   tagline: 'Self-study — exploring scripture and your nature', icon: 'book-open' },
    'tapas.json':              { id: 'tapas',               title: 'Tapas',                       tagline: 'Austerity — the transforming fire of discipline',  icon: 'flame'     },
    'santosha.json':           { id: 'santosha',            title: 'Santosha',                    tagline: 'Contentment — at peace with what is',              icon: 'heart'     },
    'shauch.json':             { id: 'shauch',              title: 'Shauch',                      tagline: 'Purity — cleansing body and mind for clarity',     icon: 'wind'      },
  };

  let existing;
  if (!fs.existsSync(filePath)) {
    const meta = TOPIC_META[fileName];
    if (!meta) { console.warn(`JSON not found and no metadata: ${fileName}`); continue; }
    existing = { ...meta, description: meta.tagline, totalSections: 0, sections: [] };
    console.log(`  Creating new topic: ${fileName}`);
  } else {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  const sections = dataRows.map((row, i) => {
    const sutraNum = cleanSutraNumber(row[CI.sutraNo]);
    const gurudevVal = CI.gurudev >= 0 ? clean(row[CI.gurudev]) : '';
    const section = {
      section: i + 1,
      theme: clean(row[CI.theme]),
      sutra: {
        number: sutraNum,
        sanskrit: cleanSanskrit(row[CI.sanskrit]),
        transliteration: sutraNum ? `Sutra ${sutraNum}` : '',
        meaning: clean(row[CI.meaning]),
      },
      insight: clean(row[CI.insight]),
      reflectionPrompt: clean(row[CI.reflection]),
      practice: clean(row[CI.practice]),
      meditation: clean(row[CI.meditation]),
      journalPrompt: clean(row[CI.journal]),
      whatOthersSaid: '',
      shlokaFrom: clean(row[CI.shloka]),
      wisdomFrom: clean(row[CI.wisdom]),
    };
    if (gurudevVal) section.gurudevInsight = gurudevVal;
    return section;
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
