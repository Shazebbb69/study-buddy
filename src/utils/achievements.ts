import { Achievement, AchievementProgress, ACHIEVEMENTS } from "../types/achievements";
import { getSessions, StudySession } from "./storage";

const ACHIEVEMENTS_KEY = "studybuddy_achievements";

interface StoredAchievements {
  unlockedIds: string[];
  unlockedDates: Record<string, string>;
}

export const getStoredAchievements = (): StoredAchievements => {
  const data = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!data) return { unlockedIds: [], unlockedDates: {} };
  try {
    return JSON.parse(data);
  } catch {
    return { unlockedIds: [], unlockedDates: {} };
  }
};

export const saveUnlockedAchievement = (achievementId: string): void => {
  const stored = getStoredAchievements();
  if (!stored.unlockedIds.includes(achievementId)) {
    stored.unlockedIds.push(achievementId);
    stored.unlockedDates[achievementId] = new Date().toISOString();
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(stored));
  }
};

export const getUnlockedAchievements = (): Achievement[] => {
  const stored = getStoredAchievements();
  return ACHIEVEMENTS.filter((a) => stored.unlockedIds.includes(a.id)).map((a) => ({
    ...a,
    unlockedAt: stored.unlockedDates[a.id],
  }));
};

export const getLockedAchievements = (): Achievement[] => {
  const stored = getStoredAchievements();
  return ACHIEVEMENTS.filter((a) => !stored.unlockedIds.includes(a.id));
};

// Calculate streak (consecutive days with sessions)
export const calculateStreak = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique days with sessions (sorted newest first)
  const sessionDays = [...new Set(
    sessions.map((s) => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )].sort((a, b) => b - a);

  if (sessionDays.length === 0) return 0;

  // Check if today or yesterday has a session
  const latestSession = new Date(sessionDays[0]);
  const daysDiff = Math.floor((today.getTime() - latestSession.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 1) return 0; // Streak broken

  let streak = 1;
  for (let i = 1; i < sessionDays.length; i++) {
    const prevDay = new Date(sessionDays[i - 1]);
    const currDay = new Date(sessionDays[i]);
    const diff = Math.floor((prevDay.getTime() - currDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Get longest single session in minutes
export const getLongestSession = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;
  const maxSeconds = Math.max(...sessions.map((s) => s.duration));
  return Math.floor(maxSeconds / 60);
};

// Check which achievements should be unlocked based on current progress
export const checkAchievements = (): Achievement[] => {
  const sessions = getSessions();
  const stored = getStoredAchievements();
  const newlyUnlocked: Achievement[] = [];

  const totalSessions = sessions.length;
  const totalMinutes = Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60);
  const streak = calculateStreak(sessions);
  const longestSession = getLongestSession(sessions);

  for (const achievement of ACHIEVEMENTS) {
    if (stored.unlockedIds.includes(achievement.id)) continue;

    let progress = 0;
    switch (achievement.category) {
      case "sessions":
        progress = totalSessions;
        break;
      case "time":
        progress = totalMinutes;
        break;
      case "consistency":
        progress = streak;
        break;
      case "focus":
        progress = longestSession;
        break;
    }

    if (progress >= achievement.requirement) {
      saveUnlockedAchievement(achievement.id);
      newlyUnlocked.push({
        ...achievement,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
};

// Get progress for all achievements
export const getAchievementsProgress = (): AchievementProgress[] => {
  const sessions = getSessions();
  const stored = getStoredAchievements();

  const totalSessions = sessions.length;
  const totalMinutes = Math.floor(sessions.reduce((acc, s) => acc + s.duration, 0) / 60);
  const streak = calculateStreak(sessions);
  const longestSession = getLongestSession(sessions);

  return ACHIEVEMENTS.map((achievement) => {
    let currentProgress = 0;
    switch (achievement.category) {
      case "sessions":
        currentProgress = totalSessions;
        break;
      case "time":
        currentProgress = totalMinutes;
        break;
      case "consistency":
        currentProgress = streak;
        break;
      case "focus":
        currentProgress = longestSession;
        break;
    }

    return {
      id: achievement.id,
      currentProgress: Math.min(currentProgress, achievement.requirement),
      requirement: achievement.requirement,
      isUnlocked: stored.unlockedIds.includes(achievement.id),
      unlockedAt: stored.unlockedDates[achievement.id],
    };
  });
};
