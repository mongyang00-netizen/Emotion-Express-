import { execSync } from 'child_process';
import fs from 'fs';

const pages = [
  {
    page: 1,
    text: "School was over. Leo sent a message to his best friend Max. Do you want to ride bikes today?",
  },
  {
    page: 2,
    text: "Two hours passed, but there was no reply. The message was unread. Leo sat on the bench and felt worried.",
  },
  {
    page: 3,
    text: "The next morning, Leo saw Max at school. Max was talking and laughing with other friends. He did not look at Leo.",
  },
  {
    page: 4,
    text: "Leo sat at his desk quietly. Is Max mad at me? he thought. Leo felt anxious about their friendship.",
  },
  {
    page: 5,
    text: "At lunch, Leo walked to Max. He asked softly, Max, did you see my message yesterday?",
  },
  {
    page: 6,
    text: "Max showed his phone. The screen was cracked and black! I dropped it during soccer, said Max. Leo felt so relieved.",
  },
  {
    page: 7,
    text: "Max smiled. My dad can fix it on Saturday. Let us ride our bikes this weekend! Leo smiled too.",
  },
  {
    page: 8,
    text: "They walked home together and ate sweet ice cream. Leo felt so excited for the weekend bike ride.",
  },
];

async function generateAll() {
  const dir = './public/audio';
  fs.mkdirSync(dir, { recursive: true });

  for (const item of pages) {
    const encoded = encodeURIComponent(item.text);
    const dest = `${dir}/page_${item.page}.mp3`;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en-US&client=tw-ob`;
    
    console.log(`Downloading female voice audio for Page ${item.page}...`);
    execSync(`curl -s -A "Mozilla/5.0" "${url}" -o "${dest}"`);

    const dur = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${dest}"`).toString().trim();
    console.log(`Page ${item.page} ready! Duration: ${parseFloat(dur).toFixed(2)}s`);
  }

  console.log('All 8 pages successfully generated with uniform American female voice!');
}

generateAll().catch(console.error);
