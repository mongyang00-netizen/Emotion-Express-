import fs from 'fs';
import { execSync } from 'child_process';

const wordsDir = './public/audio/words';
const examplesDir = './public/audio/examples';
fs.mkdirSync(wordsDir, { recursive: true });
fs.mkdirSync(examplesDir, { recursive: true });

// Read story data
const storyContent = fs.readFileSync('./src/data/storyData.ts', 'utf-8');

// Extract all English words from storyData
const allTextMatches = [...storyContent.matchAll(/'([^']+)'/g)].map(m => m[1]);
const uniqueWords = new Set();

for (const text of allTextMatches) {
  // If text contains English words, collect them
  if (/[a-zA-Z]/.test(text)) {
    const tokens = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
    for (const t of tokens) {
      if (t.length >= 1 && t.length <= 25) {
        uniqueWords.add(t);
      }
    }
  }
}

// Extra words like see, happy, sleepy, bored, proud, ignore, why, what, how, does, feel, feelings
const extraWords = [
  'see', 'why', 'how', 'what', 'does', 'feel', 'feelings', 'happy', 'sleepy',
  'bored', 'proud', 'ignore', 'him', 'purpose', 'practice', 'tasted', 'good',
  'will', 'bought', 'new', 'has', 'homework', 'lost', 'found', 'game', 'broken',
  'because', 'when', 'after', 'with', 'together', 'alone', 'screen', 'cracked',
  'soccer', 'bike', 'bikes', 'desk', 'bench', 'phone', 'friend', 'friends',
  'worried', 'anxious', 'relieved', 'excited'
];
for (const ew of extraWords) uniqueWords.add(ew);

console.log(`Checking ${uniqueWords.size} words...`);

const existing = new Set(fs.readdirSync(wordsDir).map(f => f.replace('.mp3', '')));
const missing = [...uniqueWords].filter(w => !existing.has(w));
console.log(`Missing words count: ${missing.length}`);

for (const w of missing) {
  const dest = `${wordsDir}/${w}.mp3`;
  const encoded = encodeURIComponent(w);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-US&client=tw-ob`;
  try {
    execSync(`curl -s -A "Mozilla/5.0" "${url}" -o "${dest}"`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      console.log(`Generated: ${w} (${fs.statSync(dest).size} bytes)`);
    } else {
      console.warn(`Warning: failed or empty for ${w}`);
    }
  } catch (err) {
    console.error(`Error on ${w}:`, err.message);
  }
}

// Check the 4 core emotion examples
const coreExamples = [
  { id: 'worried', text: 'Leo was worried when his friend did not reply.' },
  { id: 'anxious', text: 'I felt anxious before the big school race.' },
  { id: 'relieved', text: 'Leo felt relieved when he saw the broken phone.' },
  { id: 'excited', text: 'The two friends were excited to ride bikes this weekend.' }
];

for (const ex of coreExamples) {
  const dest = `${examplesDir}/${ex.id}.mp3`;
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
    const encoded = encodeURIComponent(ex.text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-US&client=tw-ob`;
    execSync(`curl -s -A "Mozilla/5.0" "${url}" -o "${dest}"`);
    console.log(`Generated example: ${ex.id} (${fs.statSync(dest).size} bytes)`);
  } else {
    console.log(`Example already present: ${ex.id} (${fs.statSync(dest).size} bytes)`);
  }
}

console.log('Finished checking and generating all MP3 audio!');
