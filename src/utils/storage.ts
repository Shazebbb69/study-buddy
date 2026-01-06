export interface StudySession {
  id: string;
  duration: number; // in seconds
  date: string;
}

const STORAGE_KEY = "studybuddy_sessions";

export const getSessions = (): StudySession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as StudySession[];
  } catch {
    return [];
  }
};

export const saveSession = (duration: number): void => {
  const sessions = getSessions();
  const newSession: StudySession = {
    id: crypto.randomUUID(),
    duration,
    date: new Date().toISOString(),
  };
  sessions.push(newSession);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getTotalTime = (): number => {
  const sessions = getSessions();
  return sessions.reduce((acc, session) => acc + session.duration, 0);
};

export const getTotalSessions = (): number => {
  return getSessions().length;
};
