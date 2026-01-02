import { useState, useEffect, useCallback, useRef } from 'react';

type Status = 'idle' | 'focusing' | 'completed' | 'break';

export const DURATION_OPTIONS = [15, 30, 45, 60] as const;
export type DurationOption = typeof DURATION_OPTIONS[number];

const STORAGE_KEY = 'studybuddy_data';
const DURATION_KEY = 'studybuddy_duration';

interface StudyData {
  todayMinutes: number;
  streak: number;
  lastStudyDate: string;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const loadStudyData = (): StudyData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StudyData = JSON.parse(stored);
      const today = getTodayDate();
      
      if (data.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        return {
          todayMinutes: 0,
          streak: data.lastStudyDate === yesterdayStr ? data.streak : 0,
          lastStudyDate: today,
        };
      }
      return data;
    }
  } catch (e) {
    console.error('Error loading study data:', e);
  }
  return { todayMinutes: 0, streak: 0, lastStudyDate: getTodayDate() };
};

const saveStudyData = (data: StudyData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving study data:', e);
  }
};

const loadDuration = (): DurationOption => {
  try {
    const stored = localStorage.getItem(DURATION_KEY);
    if (stored) {
      const val = parseInt(stored, 10) as DurationOption;
      if (DURATION_OPTIONS.includes(val)) return val;
    }
  } catch (e) {
    console.error('Error loading duration:', e);
  }
  return 30;
};

const saveDuration = (duration: DurationOption) => {
  try {
    localStorage.setItem(DURATION_KEY, duration.toString());
  } catch (e) {
    console.error('Error saving duration:', e);
  }
};

export const useStudyTimer = () => {
  const [focusDuration, setFocusDurationState] = useState<DurationOption>(loadDuration);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [status, setStatus] = useState<Status>('idle');
  const [studyData, setStudyData] = useState<StudyData>(loadStudyData);
  const intervalRef = useRef<number | null>(null);
  const currentDurationRef = useRef(focusDuration);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setFocusDuration = useCallback((duration: DurationOption) => {
    setFocusDurationState(duration);
    saveDuration(duration);
    if (status === 'idle' || status === 'break') {
      setTimeLeft(duration * 60);
    }
  }, [status]);

  const startFocus = useCallback(() => {
    currentDurationRef.current = focusDuration;
    setStatus('focusing');
    setTimeLeft(focusDuration * 60);
  }, [focusDuration]);

  const takeBreak = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('break');
    setTimeLeft(focusDuration * 60);
  }, [focusDuration]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('idle');
    setTimeLeft(focusDuration * 60);
  }, [focusDuration]);

  useEffect(() => {
    if (status === 'focusing') {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setStatus('completed');
            
            const completedMinutes = currentDurationRef.current;
            setStudyData((prevData) => {
              const today = getTodayDate();
              const wasFirstSessionToday = prevData.lastStudyDate !== today || prevData.todayMinutes === 0;
              
              const newData: StudyData = {
                todayMinutes: (prevData.lastStudyDate === today ? prevData.todayMinutes : 0) + completedMinutes,
                streak: wasFirstSessionToday && prevData.lastStudyDate !== today 
                  ? prevData.streak + 1 
                  : prevData.streak || 1,
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  useEffect(() => {
    setStudyData(loadStudyData());
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    status,
    todayMinutes: studyData.todayMinutes,
    streak: studyData.streak,
    focusDuration,
    setFocusDuration,
    startFocus,
    takeBreak,
    reset,
  };
};
