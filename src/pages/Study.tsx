import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Timer from "../components/Timer";
import TimerPresets from "../components/TimerPresets";
import Button from "../components/Button";
import GhostBuddy, { GhostState } from "../components/GhostBuddy";
import ThemeToggle from "../components/ThemeToggle";
import SettingsPanel from "../components/SettingsPanel";
import { saveSession, getSessions } from "../utils/storage";
import { getPreferences } from "../utils/preferences";
import { playStartSound, playPauseSound, playResumeSound, playCompleteSound, initAudioContext } from "../utils/sounds";
import { sendNotification } from "../utils/notifications";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { toast } from "sonner";

const Study = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [customMinutes, setCustomMinutes] = useState("30");
  const [seconds, setSeconds] = useState(30 * 60); // Countdown timer
  const [isRunning, setIsRunning] = useState(false);
  const [ghostState, setGhostState] = useState<GhostState>("idle");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const initialSecondsRef = useRef(30 * 60);

  // Calculate today's study time
  const todayStudied = getSessions()
    .filter((s) => new Date(s.date).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.duration, 0);
  const todayMinutes = Math.floor(todayStudied / 60);

  // Load preferences on mount
  useEffect(() => {
    const prefs = getPreferences();
    setSoundEnabled(prefs.soundEnabled);
    setNotificationsEnabled(prefs.notificationsEnabled);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            // Timer completed
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  const playSound = useCallback((soundFn: () => void) => {
    if (soundEnabled) {
      initAudioContext();
      soundFn();
    }
  }, [soundEnabled]);

  const notify = useCallback((title: string, body: string) => {
    if (notificationsEnabled) {
      sendNotification(title, body);
    }
  }, [notificationsEnabled]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setGhostState("completed");
    playSound(playCompleteSound);
    notify("StudyBuddy", "Amazing work! Session complete 🎉");
    
    // Save the session
    const studiedSeconds = initialSecondsRef.current;
    saveSession(studiedSeconds);
    toast.success("Session complete!", {
      description: `You studied for ${Math.floor(studiedSeconds / 60)} minutes.`,
    });

    // Reset after celebration
    setTimeout(() => {
      setSeconds(selectedMinutes * 60);
      setGhostState("idle");
      hasStartedRef.current = false;
    }, 3000);
  };

  const handlePresetSelect = (minutes: number) => {
    if (isRunning) return;
    setSelectedMinutes(minutes);
    setCustomMinutes(minutes.toString());
    setSeconds(minutes * 60);
    initialSecondsRef.current = minutes * 60;
  };

  const handleCustomChange = (value: string) => {
    setCustomMinutes(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 180) {
      setSelectedMinutes(num);
      setSeconds(num * 60);
      initialSecondsRef.current = num * 60;
    }
  };

  const handleStartFocus = useCallback(() => {
    if (seconds === 0) {
      // Reset if timer was completed
      setSeconds(selectedMinutes * 60);
      initialSecondsRef.current = selectedMinutes * 60;
    }
    
    if (!isRunning) {
      setIsRunning(true);
      setGhostState("focusing");
      
      if (!hasStartedRef.current) {
        playSound(playStartSound);
        notify("StudyBuddy", "Focus session started. You've got this! 💪");
        hasStartedRef.current = true;
        initialSecondsRef.current = seconds;
      } else {
        playSound(playResumeSound);
      }
    } else {
      setIsRunning(false);
      setGhostState("paused");
      playSound(playPauseSound);
      notify("StudyBuddy", "Session paused. Take your time. ☕");
    }
  }, [seconds, selectedMinutes, isRunning, playSound, notify]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSeconds(selectedMinutes * 60);
    setGhostState("idle");
    hasStartedRef.current = false;
    initialSecondsRef.current = selectedMinutes * 60;
  }, [selectedMinutes]);

  // Keyboard shortcuts: Space = start/pause, R = reset
  useKeyboardShortcuts({
    onSpace: handleStartFocus,
    onReset: handleReset,
    enabled: true,
  });

  const getButtonText = () => {
    if (isRunning) return "Pause";
    if (seconds === 0) return "Start Focus";
    if (hasStartedRef.current) return "Resume";
    return "Start Focus";
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />
      <SettingsPanel
        onSoundChange={setSoundEnabled}
        onNotificationChange={setNotificationsEnabled}
      />

      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Main card */}
        <motion.div
          className="w-full max-w-md bg-card rounded-3xl shadow-card border border-border p-8 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Ghost */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <GhostBuddy size="md" state={ghostState} showLabel={true} />
          </motion.div>

          {/* Timer */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Timer seconds={seconds} isRunning={isRunning} />
          </motion.div>

          {/* Presets */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <TimerPresets
              selectedMinutes={selectedMinutes}
              onSelect={handlePresetSelect}
              customMinutes={customMinutes}
              onCustomChange={handleCustomChange}
              disabled={isRunning}
            />
          </motion.div>

          {/* Start button */}
          <motion.div
            className="flex justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={handleStartFocus} variant="primary" className="px-10 py-3">
              {getButtonText()}
            </Button>
            {hasStartedRef.current && (
              <Button onClick={handleReset} variant="secondary" className="px-6 py-3">
                Reset
              </Button>
            )}
          </motion.div>

          {/* Today's stats */}
          <motion.p
            className="text-center text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Today: <span className="font-semibold text-foreground">{todayMinutes} min</span> studied
          </motion.p>
        </motion.div>

        {/* Footer branding */}
        <motion.p
          className="text-xs text-muted-foreground/50 mt-8 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Study Buddy
        </motion.p>
      </motion.div>

      <Navbar />
    </div>
  );
};

export default Study;
