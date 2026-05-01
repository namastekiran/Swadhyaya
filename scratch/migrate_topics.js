const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://iquipacnknlwifijwbaf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWlwYWNua25sd2lmaWp3YmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NzYwMzUsImV4cCI6MjA5MjE1MjAzNX0.5WgiPe8NfH5bz4IJ-v77kQkvCr-gNBeeg4t6RSxpP9M';
const supabase = createClient(supabaseUrl, supabaseKey);

const topicsDir = 'c:/Sheela/Swadhyaya/content/topics';

async function migrate() {
    const files = fs.readdirSync(topicsDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} topics to migrate...`);

    for (const file of files) {
        const filePath = path.join(topicsDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const slug = file.replace('.json', '');
        
        console.log(`Migrating: ${slug}...`);
        
        const { error } = await supabase
            .from('topics')
            .upsert({
                slug: slug,
                title: content.title || slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
                content: content,
                category: content.category || 'General'
            }, { onConflict: 'slug' });

        if (error) {
            console.error(`Error migrating ${slug}:`, error.message);
        }
    }
    console.log('Migration complete!');
}

migrate();
