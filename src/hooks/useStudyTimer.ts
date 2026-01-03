import { useState, useEffect, useCallback, useRef } from "react";

type Status = "idle" | "focusing" | "paused" | "completed" | "break";

export const DURATION_OPTIONS = [15, 30, 45, 60] as const;

const STORAGE_KEY = "studybuddy_data";
const DURATION_KEY = "studybuddy_duration";

interface StudyData {
  todayMinutes: number;
  streak: number;
  lastStudyDate: string;
}

const getTodayDate = () => new Date().toISOString().split("T")[0];

/* ---------- persistence ---------- */

const loadStudyData = (): StudyData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StudyData = JSON.parse(stored);
      const today = getTodayDate();

      if (data.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        return {
          todayMinutes: 0,
          streak: data.lastStudyDate === yesterdayStr ? data.streak : 0,
          lastStudyDate: today,
        };
      }
      return data;
    }
  } catch {}
  return { todayMinutes: 0, streak: 0, lastStudyDate: getTodayDate() };
};

const saveStudyData = (data: StudyData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadDuration = (): number => {
  const stored = localStorage.getItem(DURATION_KEY);
  return stored ? parseInt(stored, 10) : 30;
};

const saveDuration = (duration: number) => {
  localStorage.setItem(DURATION_KEY, duration.toString());
};

/* ---------- hook ---------- */

export const useStudyTimer = () => {
  const [focusDuration, setFocusDuration] = useState<number>(loadDuration);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [status, setStatus] = useState<Status>("idle");
  const [studyData, setStudyData] = useState<StudyData>(loadStudyData);

  const intervalRef = useRef<number | null>(null);
  const currentDurationRef = useRef(focusDuration);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  /* ---------- duration ---------- */

  const setDuration = useCallback(
    (minutes: number) => {
      if (Number.isNaN(minutes) || minutes < 5) return;

      setFocusDuration(minutes);
      saveDuration(minutes);

      if (status === "idle" || status === "break") {
        setTimeLeft(minutes * 60);
      }
    },
    [status]
  );

  /* ---------- controls ---------- */

  const startFocus = useCallback(() => {
    currentDurationRef.current = focusDuration;
    setStatus("focusing");
    setTimeLeft(focusDuration * 60);
  }, [focusDuration]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    setStatus("focusing");
  }, []);

  const takeBreak = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    setStatus("break");
    setTimeLeft(5 * 60);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    setStatus("idle");
    setTimeLeft(focusDuration * 60);
  }, [focusDuration]);

  /* ---------- timer engine ---------- */

  useEffect(() => {
    if (status === "focusing") {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;

            setStatus("completed");

            const completedMinutes = currentDurationRef.current;
            setStudyData((prevData) => {
              const today = getTodayDate();
              const newData: StudyData = {
                todayMinutes:
                  (prevData.lastStudyDate === today
                    ? prevData.todayMinutes
                    : 0) + completedMinutes,
                streak:
                  prevData.lastStudyDate === today
                    ? prevData.streak
                    : prevData.streak + 1,
                lastStudyDate: today,
              };
              saveStudyData(newData);
              return newData;
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    status,
    todayMinutes: studyData.todayMinutes,
    streak: studyData.streak,
    focusDuration,

    durationOptions: DURATION_OPTIONS,
    setFocusDuration: setDuration,

    startFocus,
    pause,
    resume,
    takeBreak,
    reset,
  };
};
