export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "sessions" | "time" | "consistency" | "focus";
  requirement: number;
  unlockedAt?: string;
}

export interface AchievementProgress {
  id: string;
  currentProgress: number;
  requirement: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Session-based achievements
  {
    id: "first_session",
    name: "First Steps",
    description: "Complete your first study session",
    icon: "🌱",
    category: "sessions",
    requirement: 1,
  },
  {
    id: "five_sessions",
    name: "Focus Master",
    description: "Complete 5 study sessions",
    icon: "🎯",
    category: "sessions",
    requirement: 5,
  },
  {
    id: "ten_sessions",
    name: "Dedicated Learner",
    description: "Complete 10 study sessions",
    icon: "📖",
    category: "sessions",
    requirement: 10,
  },
  {
    id: "fifty_sessions",
    name: "Study Champion",
    description: "Complete 50 study sessions",
    icon: "🏆",
    category: "sessions",
    requirement: 50,
  },
  {
    id: "hundred_sessions",
    name: "Legend",
    description: "Complete 100 study sessions",
    icon: "👑",
    category: "sessions",
    requirement: 100,
  },

  // Time-based achievements
  {
    id: "one_hour_total",
    name: "Hour Hero",
    description: "Study for 1 hour total",
    icon: "⏱️",
    category: "time",
    requirement: 60,
  },
  {
    id: "five_hours_total",
    name: "Time Keeper",
    description: "Study for 5 hours total",
    icon: "⌛",
    category: "time",
    requirement: 300,
  },
  {
    id: "ten_hours_total",
    name: "Time Master",
    description: "Study for 10 hours total",
    icon: "🕐",
    category: "time",
    requirement: 600,
  },
  {
    id: "fifty_hours_total",
    name: "Time Lord",
    description: "Study for 50 hours total",
    icon: "⏰",
    category: "time",
    requirement: 3000,
  },

  // Consistency achievements
  {
    id: "three_day_streak",
    name: "Getting Started",
    description: "Study 3 days in a row",
    icon: "🔥",
    category: "consistency",
    requirement: 3,
  },
  {
    id: "seven_day_streak",
    name: "Consistency Champ",
    description: "Study 7 days in a row",
    icon: "📚",
    category: "consistency",
    requirement: 7,
  },
  {
    id: "fourteen_day_streak",
    name: "Unstoppable",
    description: "Study 14 days in a row",
    icon: "💪",
    category: "consistency",
    requirement: 14,
  },
  {
    id: "thirty_day_streak",
    name: "Monthly Master",
    description: "Study 30 days in a row",
    icon: "🌟",
    category: "consistency",
    requirement: 30,
  },

  // Focus achievements (single session)
  {
    id: "thirty_min_session",
    name: "Focused Mind",
    description: "Complete a 30-minute session",
    icon: "🧠",
    category: "focus",
    requirement: 30,
  },
  {
    id: "sixty_min_session",
    name: "Deep Thinker",
    description: "Complete a 60-minute session",
    icon: "💭",
    category: "focus",
    requirement: 60,
  },
  {
    id: "ninety_min_session",
    name: "Deep Work Hero",
    description: "Complete a 90-minute session",
    icon: "🦸",
    category: "focus",
    requirement: 90,
  },
  {
    id: "two_hour_session",
    name: "Ultra Focus",
    description: "Complete a 2-hour session",
    icon: "⚡",
    category: "focus",
    requirement: 120,
  },
];
