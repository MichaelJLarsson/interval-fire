/**
 * Generates ElevenLabs voice clips for all interval-fire phrases.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=<key> npx ts-node scripts/generate-voices.ts
 *
 * Voice: Adam (pNInz6obpgDQGcFmaJgB) — authoritative, energetic coaching tone.
 * To use a different voice, replace VOICE_ID with any ElevenLabs voice ID.
 * Browse voices at: https://elevenlabs.io/voice-library
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam
const MODEL_ID = 'eleven_turbo_v2_5';
const OUT_DIR = path.join(__dirname, '../assets/voice');

const PHRASES: Record<string, string> = {
  prep: 'Get ready!',
  work: 'Work!',
  rest: 'Rest!',
  last_round: 'Last round!',
  three: '3',
  two: '2',
  one: '1',
  complete: 'Workout complete! Great job!',
};

async function generate(phrase: string, text: string): Promise<void> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75,
          style: 0.6,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs error for "${phrase}": ${res.status} ${body}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUT_DIR, `${phrase}.mp3`);
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ ${outPath}  (${buffer.length} bytes)`);
}

async function main() {
  if (!API_KEY) {
    console.error('Error: ELEVENLABS_API_KEY environment variable is not set.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Generating ${Object.keys(PHRASES).length} voice clips → ${OUT_DIR}\n`);

  for (const [phrase, text] of Object.entries(PHRASES)) {
    await generate(phrase, text);
  }

  console.log('\nDone! Run the app to hear the new voices.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
