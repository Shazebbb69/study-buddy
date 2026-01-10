import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Timer from "../components/Timer";
import Stopwatch from "../components/Stopwatch";
import TimerPresets from "../components/TimerPresets";
import ModeToggle, { StudyMode } from "../components/ModeToggle";
import Button from "../components/Button";
import GhostBuddy, { GhostState } from "../components/GhostBuddy";
import ThemeToggle from "../components/ThemeToggle";
import AchievementsPanel from "../components/AchievementsPanel";
import AchievementToast from "../components/AchievementToast";
import { saveSession, getSessions } from "../utils/storage";
import { getPreferences } from "../utils/preferences";
import { playStartSound, playPauseSound, playResumeSound, playCompleteSound, initAudioContext } from "../utils/sounds";
import { sendNotification } from "../utils/notifications";
import { checkAchievements } from "../utils/achievements";
import { Achievement } from "../types/achievements";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { toast } from "sonner";

const Study = () => {
  const [mode, setMode] = useState<StudyMode>("timer");
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [customMinutes, setCustomMinutes] = useState("30");
  const [seconds, setSeconds] = useState(30 * 60); // For timer countdown
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0); // For stopwatch count-up
  const [isRunning, setIsRunning] = useState(false);
  const [ghostState, setGhostState] = useState<GhostState>("idle");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
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

  // Timer/Stopwatch effect
  useEffect(() => {
    if (isRunning) {
      if (mode === "timer") {
        // Countdown timer
        if (seconds > 0) {
          intervalRef.current = window.setInterval(() => {
            setSeconds((prev) => {
              if (prev <= 1) {
                handleTimerComplete();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        // Stopwatch count-up
        intervalRef.current = window.setInterval(() => {
          setStopwatchSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, seconds]);

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

    // Check for new achievements
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      // Show first unlocked achievement (queue others if needed)
      setTimeout(() => {
        setUnlockedAchievement(newAchievements[0]);
      }, 1000);
    }

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
    if (mode === "timer" && seconds === 0) {
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
        if (mode === "timer") {
          initialSecondsRef.current = seconds;
        }
      } else {
        playSound(playResumeSound);
      }
    } else {
      setIsRunning(false);
      setGhostState("paused");
      playSound(playPauseSound);
      notify("StudyBuddy", "Session paused. Take your time. ☕");
    }
  }, [mode, seconds, selectedMinutes, isRunning, playSound, notify]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    if (mode === "timer") {
      setSeconds(selectedMinutes * 60);
      initialSecondsRef.current = selectedMinutes * 60;
    } else {
      setStopwatchSeconds(0);
    }
    setGhostState("idle");
    hasStartedRef.current = false;
  }, [mode, selectedMinutes]);

  const handleModeChange = (newMode: StudyMode) => {
    if (isRunning) return;
    setMode(newMode);
    hasStartedRef.current = false;
    setGhostState("idle");
  };

  const handleStopwatchComplete = useCallback(() => {
    if (mode !== "stopwatch" || stopwatchSeconds === 0) return;
    
    setIsRunning(false);
    setGhostState("completed");
    playSound(playCompleteSound);
    notify("StudyBuddy", "Amazing work! Session complete 🎉");
    
    // Save the session
    saveSession(stopwatchSeconds);
    toast.success("Session complete!", {
      description: `You studied for ${Math.floor(stopwatchSeconds / 60)} minutes.`,
    });

    // Check for new achievements
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      setTimeout(() => {
        setUnlockedAchievement(newAchievements[0]);
      }, 1000);
    }

    // Reset after celebration
    setTimeout(() => {
      setStopwatchSeconds(0);
      setGhostState("idle");
      hasStartedRef.current = false;
    }, 3000);
  }, [mode, stopwatchSeconds, playSound, notify]);

  // Keyboard shortcuts: Space = start/pause, R = reset
  useKeyboardShortcuts({
    onSpace: handleStartFocus,
    onReset: handleReset,
    enabled: true,
  });

  const getButtonText = () => {
    if (mode === "stopwatch") {
      if (isRunning) return "Pause";
      if (stopwatchSeconds > 0 && !isRunning) return hasStartedRef.current ? "Resume" : "Finish";
      return "Start";
    }
    // Timer mode
    if (isRunning) return "Pause";
    if (seconds === 0) return "Start Focus";
    if (hasStartedRef.current) return "Resume";
    return "Start Focus";
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />
      <AchievementsPanel />
      <AchievementToast
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
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
          {/* Mode Toggle */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ModeToggle mode={mode} onModeChange={handleModeChange} disabled={isRunning} />
          </motion.div>

          {/* Ghost */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <GhostBuddy size="md" state={ghostState} showLabel={true} />
          </motion.div>

          {/* Timer or Stopwatch */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mode === "timer" ? (
              <Timer seconds={seconds} isRunning={isRunning} />
            ) : (
              <Stopwatch seconds={stopwatchSeconds} isRunning={isRunning} />
            )}
          </motion.div>

          {/* Presets - only show for timer mode */}
          {mode === "timer" && (
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
          )}

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
            {mode === "stopwatch" && stopwatchSeconds > 0 && !isRunning && (
              <Button onClick={handleStopwatchComplete} variant="primary" className="px-6 py-3">
                Finish
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
    </div>
  );
};

export default Study;
