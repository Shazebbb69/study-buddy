// Soft, minimal sound effects using Web Audio API
const audioContext = typeof window !== "undefined" ? new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

const playTone = (frequency: number, duration: number, volume: number = 0.1): void => {
  if (!audioContext) return;

  // Resume context if suspended (required after user interaction)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Soft envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const playStartSound = (): void => {
  // Gentle ascending tone
  playTone(523.25, 0.15, 0.08); // C5
  setTimeout(() => playTone(659.25, 0.2, 0.08), 100); // E5
};

export const playPauseSound = (): void => {
  // Soft descending tone
  playTone(440, 0.2, 0.06); // A4
};

export const playResumeSound = (): void => {
  // Quick gentle blip
  playTone(587.33, 0.15, 0.07); // D5
};

export const playCompleteSound = (): void => {
  // Pleasant completion chime
  playTone(523.25, 0.15, 0.08); // C5
  setTimeout(() => playTone(659.25, 0.15, 0.08), 120); // E5
  setTimeout(() => playTone(783.99, 0.25, 0.1), 240); // G5
};

export const initAudioContext = (): void => {
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
};
