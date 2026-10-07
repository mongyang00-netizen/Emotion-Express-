import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const pages = [
  {
    page: 1,
    text: "School was over. Leo sent a message to his best friend Max. Do you want to ride bikes today?",
    sentences: [
      "School was over.",
      "Leo sent a message to his best friend Max.",
      "Do you want to ride bikes today?"
    ]
  },
  {
    page: 2,
    text: "Two hours passed, but there was no reply. The message was unread. Leo sat on the bench and felt worried.",
    sentences: [
      "Two hours passed, but there was no reply.",
      "The message was unread.",
      "Leo sat on the bench and felt worried."
    ]
  },
  {
    page: 3,
    text: "The next morning, Leo saw Max at school. Max was talking and laughing with other friends. He did not look at Leo.",
    sentences: [
      "The next morning, Leo saw Max at school.",
      "Max was talking and laughing with other friends.",
      "He did not look at Leo."
    ]
  },
  {
    page: 4,
    text: "Leo sat at his desk quietly. Is Max mad at me? he thought. Leo felt anxious about their friendship.",
    sentences: [
      "Leo sat at his desk quietly.",
      "Is Max mad at me? he thought.",
      "Leo felt anxious about their friendship."
    ]
  },
  {
    page: 5,
    text: "At lunch, Leo walked to Max. He asked softly, Max, did you see my message yesterday?",
    sentences: [
      "At lunch, Leo walked to Max.",
      "He asked softly, Max, did you see my message yesterday?"
    ]
  },
  {
    page: 6,
    text: "Max showed his phone. The screen was cracked and black! I dropped it during soccer, said Max. Leo felt so relieved.",
    sentences: [
      "Max showed his phone.",
      "The screen was cracked and black!",
      "I dropped it during soccer, said Max.",
      "Leo felt so relieved."
    ]
  },
  {
    page: 7,
    text: "Max smiled. My dad can fix it on Saturday. Let us ride our bikes this weekend! Leo smiled too.",
    sentences: [
      "Max smiled.",
      "My dad can fix it on Saturday.",
      "Let us ride our bikes this weekend!",
      "Leo smiled too."
    ]
  },
  {
    page: 8,
    text: "They walked home together and ate sweet ice cream. Leo felt so excited for the weekend bike ride.",
    sentences: [
      "They walked home together and ate sweet ice cream.",
      "Leo felt so excited for the weekend bike ride."
    ]
  }
];

async function main() {
  const ai = new GoogleGenAI();
  const audioDir = './public/audio';
  fs.mkdirSync(audioDir, { recursive: true });

  const metadata = {};

  for (const item of pages) {
    console.log(`Generating audio for Page ${item.page}...`);
    const wavPath = `${audioDir}/page_${item.page}.wav`;
    const mp3Path = `${audioDir}/page_${item.page}.mp3`;

    if (fs.existsSync(mp3Path) && fs.statSync(mp3Path).size > 1000) {
      console.log(`Page ${item.page} already exists, skipping generation.`);
      const durationStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${mp3Path}"`).toString().trim();
      const totalDuration = parseFloat(durationStr) || 6.0;
      const totalChars = item.sentences.reduce((acc, s) => acc + s.length, 0);
      let cumulativeTime = 0;
      const sentenceTimings = item.sentences.map((sent, idx) => {
        const start = cumulativeTime;
        const proportion = sent.length / totalChars;
        const duration = totalDuration * proportion;
        cumulativeTime += duration;
        return {
          sentenceIndex: idx,
          text: sent,
          startTime: Math.round(start * 100) / 100,
          endTime: Math.round(Math.min(cumulativeTime, totalDuration) * 100) / 100,
        };
      });

      metadata[item.page] = {
        audioUrl: `/audio/page_${item.page}.mp3`,
        totalDuration: Math.round(totalDuration * 100) / 100,
        sentenceTimings
      };
      continue;
    }

    try {
      console.log(`Waiting 22s before generating Page ${item.page} to respect rate limits...`);
      await new Promise(r => setTimeout(r, 22000));
      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: item.text,
        config: {
          responseModalities: ['AUDIO']
        }
      });

      const b64 = res.candidates[0].content.parts[0].inlineData.data;
      fs.writeFileSync(wavPath, Buffer.from(b64, 'base64'));

      // Convert to MP3 using ffmpeg
      execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}" 2>/dev/null`);

      // Remove temp wav file to save space
      if (fs.existsSync(wavPath)) {
        fs.unlinkSync(wavPath);
      }

      // Get exact duration via ffprobe or ffmpeg
      const durationStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${mp3Path}"`).toString().trim();
      const totalDuration = parseFloat(durationStr) || 6.0;

      // Calculate sentence timing proportional to sentence character length
      const totalChars = item.sentences.reduce((acc, s) => acc + s.length, 0);
      let cumulativeTime = 0;
      const sentenceTimings = item.sentences.map((sent, idx) => {
        const start = cumulativeTime;
        const proportion = sent.length / totalChars;
        const duration = totalDuration * proportion;
        cumulativeTime += duration;
        return {
          sentenceIndex: idx,
          text: sent,
          startTime: Math.round(start * 100) / 100,
          endTime: Math.round(Math.min(cumulativeTime, totalDuration) * 100) / 100,
        };
      });

      metadata[item.page] = {
        audioUrl: `/audio/page_${item.page}.mp3`,
        totalDuration: Math.round(totalDuration * 100) / 100,
        sentenceTimings
      };

      console.log(`Page ${item.page} generated (${totalDuration.toFixed(1)}s)`);
    } catch (err) {
      console.error(`Error on Page ${item.page}:`, err.message);
    }
  }

  // Also clean up test.wav and test.mp3 if present
  if (fs.existsSync(`${audioDir}/test.wav`)) fs.unlinkSync(`${audioDir}/test.wav`);
  if (fs.existsSync(`${audioDir}/test.mp3`)) fs.unlinkSync(`${audioDir}/test.mp3`);

  fs.writeFileSync('./src/data/audioTimings.json', JSON.stringify(metadata, null, 2));
  console.log('Finished generating all audio files and audioTimings.json!');
}

main().catch(console.error);
