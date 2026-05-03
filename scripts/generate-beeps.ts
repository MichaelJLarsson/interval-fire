/**
 * Generates short PCM/WAV beep sounds for interval-fire countdown ticks.
 *
 * Usage: npx ts-node scripts/generate-beeps.ts
 *
 * Tweak DURATION/FREQUENCY/AMPLITUDE to taste, then re-run to overwrite the
 * bundled WAV. No external dependencies — vanilla Node fs + Buffer.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_RATE = 44100;
const DURATION = 0.08;     // seconds
const FREQUENCY = 880;     // Hz (A5)
const AMPLITUDE = 0.55;    // 0..1
const FADE_TIME = 0.008;   // attack/release to prevent clicks
const OUT_PATH = path.join(__dirname, '../assets/sounds/countdown.wav');

function buildBeep(): Buffer {
  const numSamples = Math.floor(SAMPLE_RATE * DURATION);
  const fadeSamples = Math.floor(SAMPLE_RATE * FADE_TIME);
  const dataSize = numSamples * 2; // 16-bit mono
  const buf = Buffer.alloc(44 + dataSize);
  let o = 0;

  // RIFF header
  buf.write('RIFF', o); o += 4;
  buf.writeUInt32LE(36 + dataSize, o); o += 4;
  buf.write('WAVE', o); o += 4;

  // fmt chunk
  buf.write('fmt ', o); o += 4;
  buf.writeUInt32LE(16, o); o += 4;
  buf.writeUInt16LE(1, o); o += 2;            // PCM
  buf.writeUInt16LE(1, o); o += 2;            // mono
  buf.writeUInt32LE(SAMPLE_RATE, o); o += 4;
  buf.writeUInt32LE(SAMPLE_RATE * 2, o); o += 4;
  buf.writeUInt16LE(2, o); o += 2;
  buf.writeUInt16LE(16, o); o += 2;

  // data chunk
  buf.write('data', o); o += 4;
  buf.writeUInt32LE(dataSize, o); o += 4;

  for (let i = 0; i < numSamples; i++) {
    let env = 1;
    if (i < fadeSamples) env = i / fadeSamples;
    else if (i > numSamples - fadeSamples) env = (numSamples - i) / fadeSamples;
    const s = Math.sin((2 * Math.PI * FREQUENCY * i) / SAMPLE_RATE) * AMPLITUDE * env;
    buf.writeInt16LE(Math.round(s * 32767), o);
    o += 2;
  }

  return buf;
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, buildBeep());
console.log(`✓ ${OUT_PATH}`);
