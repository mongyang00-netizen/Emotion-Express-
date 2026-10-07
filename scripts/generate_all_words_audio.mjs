import { execSync } from 'child_process';
import fs from 'fs';

// All dictionary words and core emotions
const words = [
  'school', 'was', 'over', 'leo', 'sent', 'a', 'message', 'to', 'his', 'best',
  'friend', 'friends', 'max', 'do', 'you', 'want', 'ride', 'bikes', 'bike',
  'today', 'two', 'hours', 'passed', 'but', 'there', 'no', 'reply', 'the',
  'unread', 'sat', 'on', 'bench', 'and', 'felt', 'worried', 'next', 'morning',
  'saw', 'at', 'talking', 'laughing', 'with', 'other', 'he', 'did', 'not',
  'look', 'desk', 'quietly', 'is', 'mad', 'me', 'thought', 'anxious', 'about',
  'their', 'friendship', 'lunch', 'walked', 'asked', 'softly', 'yesterday',
  'showed', 'phone', 'screen', 'cracked', 'black', 'i', 'dropped', 'it',
  'during', 'soccer', 'said', 'so', 'relieved', 'smiled', 'my', 'dad', 'can',
  'fix', 'saturday', 'let', 'us', 'our', 'this', 'weekend', 'too', 'they',
  'home', 'together', 'ate', 'sweet', 'ice', 'cream', 'excited', 'for'
];

const examples = [
  { id: 'worried', text: 'Leo was worried when his friend did not reply.' },
  { id: 'anxious', text: 'I felt anxious before the big school race.' },
  { id: 'relieved', text: 'Leo felt relieved when he saw the broken phone.' },
  { id: 'excited', text: 'The two friends were excited to ride bikes this weekend.' }
];

async function generateAll() {
  const wordsDir = './public/audio/words';
  const examplesDir = './public/audio/examples';
  fs.mkdirSync(wordsDir, { recursive: true });
  fs.mkdirSync(examplesDir, { recursive: true });

  console.log(`Starting generation for ${words.length} words...`);

  for (const word of words) {
    const dest = `${wordsDir}/${word.toLowerCase()}.mp3`;
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      continue;
    }
    const encoded = encodeURIComponent(word);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-US&client=tw-ob`;
    try {
      execSync(`curl -s -A "Mozilla/5.0" "${url}" -o "${dest}"`);
    } catch (e) {
      console.error(`Failed on word ${word}:`, e.message);
    }
  }

  console.log('Generating 4 core emotion example sentences...');
  for (const ex of examples) {
    const dest = `${examplesDir}/${ex.id}.mp3`;
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      continue;
    }
    const encoded = encodeURIComponent(ex.text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-US&client=tw-ob`;
    try {
      execSync(`curl -s -A "Mozilla/5.0" "${url}" -o "${dest}"`);
    } catch (e) {
      console.error(`Failed on example ${ex.id}:`, e.message);
    }
  }

  console.log('All word and example MP3s successfully generated!');
}

generateAll().catch(console.error);
