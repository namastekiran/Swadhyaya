const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

const supabaseUrl = 'https://iquipacnknlwifijwbaf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWlwYWNua25sd2lmaWp3YmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NzYwMzUsImV4cCI6MjA5MjE1MjAzNX0.5WgiPe8NfH5bz4IJ-v77kQkvCr-gNBeeg4t6RSxpP9M';
const supabase = createClient(supabaseUrl, supabaseKey);

const filePath = 'C:/Users/Sheela Naik/Downloads/Swadhyaya_Content.xlsx';
const workbook = XLSX.readFile(filePath);

const topicConfig = {
    'Yoga': { slug: 'yoga', tagline: 'The science of union', icon: 'Flower2' },
    'Self-Discipline': { slug: 'self-discipline', tagline: 'Cultivating the inner fire', icon: 'Flame' },
    'Practice': { slug: 'practice', tagline: 'Steady effort in the right direction', icon: 'Footprints' },
    '8-limbs': { slug: '8-limbs', tagline: 'The complete path of yoga', icon: 'LayoutGrid' },
    'Yama': { slug: 'yama', tagline: 'Outer restraints and ethics', icon: 'Shield' },
    'Niyama': { slug: 'niyama', tagline: 'Inner observances and purity', icon: 'Sparkles' },
    'Asana': { slug: 'asana', tagline: 'Steadiness and comfort', icon: 'PersonStanding' },
    'Pranayama': { slug: 'pranayama', tagline: 'Expansion of life force', icon: 'Wind' },
    'Pratyahara': { slug: 'pratyahara', tagline: 'Withdrawal of the senses', icon: 'EyeOff' },
    'Dharana': { slug: 'dharana', tagline: 'Concentration of mind', icon: 'Focus' },
    'Dhyana': { slug: 'dhyana', tagline: 'Uninterrupted flow of awareness', icon: 'Waves' },
    'Attachment': { slug: 'attachment', tagline: 'Understanding the sticky mind', icon: 'Magnet' },
    'Impressions-Karma': { slug: 'impressions-karma', tagline: 'Unweaving the seeds of action', icon: 'History' },
    'Knowledge': { slug: 'knowledge', tagline: 'Right perception and wisdom', icon: 'BookOpen' },
    'Consciousness': { slug: 'consciousness', tagline: 'The witness within', icon: 'Sun' },
    'Samyama': { slug: 'samyama', tagline: 'The triad of integration', icon: 'Merge' },
    'Dhyana-Samadhi': { slug: 'dhyana-samadhi', tagline: 'Merging with the object', icon: 'Zap' },
    'Ignorance-Suffering': { slug: 'ignorance-suffering', tagline: 'The roots of kleshas', icon: 'CloudRain' },
    'Intensity': { slug: 'intensity', tagline: 'Total commitment to the path', icon: 'Zap' },
    'Detachment': { slug: 'detachment', tagline: 'Freedom through letting go', icon: 'Leaf' }
};

async function upload() {
    for (const [sheetName, config] of Object.entries(topicConfig)) {
        console.log(`Processing ${sheetName}...`);
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            console.warn(`Sheet ${sheetName} not found.`);
            continue;
        }

        const rows = XLSX.utils.sheet_to_json(worksheet);
        const sections = rows.map((row, index) => {
            return {
                section: parseInt(row['Day'] || row['Section'] || (index + 1)),
                phase: row['Phase'] || row['Section Name'] || 'Awareness',
                theme: row['Theme'] || row['Title'] || 'Untitiled',
                sutra: {
                    number: row['Sutra Number'] || '',
                    sanskrit: row['Sutra'] || row['Concept'] || '',
                    transliteration: row['Transliteration'] || '',
                    meaning: row['Sutra Meaning'] || row['Meaning'] || ''
                },
                insight: row['Insight (Gurudev-style)'] || row['Insight'] || row['Insight / Audio'] || '',
                reflectionPrompt: row['Reflection Prompt'] || row['Reflection / AI Prompt'] || '',
                practice: row['Practice'] || row['Practice (Action)'] || '',
                meditation: row['Meditation'] || '',
                journalPrompt: row['Journal Prompt'] || '',
                whatOthersSaid: row['Extra Feature'] || '',
            };
        });

        const topicData = {
            id: config.slug,
            title: sheetName,
            tagline: config.tagline,
            description: `A journey into the depth of ${sheetName}.`,
            icon: config.icon,
            totalSections: sections.length,
            sections: sections
        };

        console.log(`Uploading ${config.slug}...`);
        const { error } = await supabase
            .from('topics')
            .upsert({
                slug: config.slug,
                title: topicData.title,
                content: topicData,
                category: 'Journey'
            }, { onConflict: 'slug' });

        if (error) {
            console.error(`Error uploading ${config.slug}:`, error.message);
        }
    }
    console.log('Upload complete!');
}

upload();
