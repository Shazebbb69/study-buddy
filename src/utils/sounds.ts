import { getPreferences } from "../utils/preferences";

const audioContext: AudioContext | null =
  typeof window !== "undefined"
    ? new (window.AudioContext ||
        // typesafe fallback for Safari
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)()
    : null;

let soundEnabled = getPreferences().soundEnabled;

if (typeof window !== "undefined") {
  window.addEventListener("preferencesChanged", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && typeof detail.soundEnabled === "boolean") {
      soundEnabled = detail.soundEnabled;
    }
  });
}

const resumeContext = async (): Promise<void> => {
  if (audioContext && audioContext.state === "suspended") {
    await audioContext.resume();
  }
};

const playTone = async (
  frequency: number,
  duration: number,
  volume: number = 0.1,
  type: OscillatorType = "sine"
): Promise<void> => {
  if (!audioContext || !soundEnabled) return;
  await resumeContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Soft attack + natural decay
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.06);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Gentle, longer completion sound as you asked (not alarming, a bit long)
export const playCompleteSound = (): void => {
  // Chime arpeggio with mellow waveform and ~2.1s total
  playTone(523.25, 0.5, 0.08, "triangle"); // C5
  playTone(659.25, 0.6, 0.08, "triangle"); // E5
  playTone(783.99, 0.7, 0.09, "triangle"); // G5
  // soft tail
  playTone(987.77, 0.3, 0.06, "sine"); // B5
};

export const playStartSound = (): void => {
  playTone(523.25, 0.18, 0.08, "sine"); // C5
  playTone(659.25, 0.22, 0.08, "sine"); // E5
};

export const playPauseSound = (): void => {
  playTone(440, 0.22, 0.06, "sine"); // A4
};

export const playResumeSound = (): void => {
  playTone(587.33, 0.18, 0.07, "sine"); // D5
};

export const initAudioContext = (): void => {
  void resumeContext();
};