const PENTATONIC_SCALE = [185.0, 220.0, 246.94, 277.18, 329.63, 369.99]; // F#, A, B, C#, E, F#

export const playBilateralFlute = (audioCtx: AudioContext) => {
  const now = audioCtx.currentTime;

  // 1. Pick a random note from the scale
  const freq =
    PENTATONIC_SCALE[Math.floor(Math.random() * PENTATONIC_SCALE.length)];

  // 2. Create the "Wood" (Oscillator)
  const osc = audioCtx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  // Add a slight "warble" (Vibrato)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 2);

  // 3. Create the "Breath" (Noise)
  const noiseBuffer = audioCtx.createBuffer(
    1,
    audioCtx.sampleRate * 2,
    audioCtx.sampleRate,
  );
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseBuffer.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;

  // 4. Filter the noise to sound like wind
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;

  // 5. Bilateral Panner (The EMDR Engine)
  const panner = audioCtx.createStereoPanner();
  // Start far left, sweep to right over 4 seconds
  panner.pan.setValueAtTime(-1, now);
  panner.pan.linearRampToValueAtTime(1, now + 4);

  // 6. Gain (Volume Envelope)
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.5); // Fade in
  gain.gain.exponentialRampToValueAtTime(0.001, now + 6); // Long fade out

  // Connect the nodes
  osc.connect(gain);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(audioCtx.destination);

  // Start the "Song"
  osc.start(now);
  noise.start(now);
  osc.stop(now + 6);
  noise.stop(now + 6);
};
