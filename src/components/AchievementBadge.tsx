import { motion } from "framer-motion";
import { Achievement, AchievementProgress } from "../types/achievements";
import { Lock } from "lucide-react";

interface AchievementBadgeProps {
  achievement: Achievement;
  progress?: AchievementProgress;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

const AchievementBadge = ({
  achievement,
  progress,
  size = "md",
  showProgress = true,
}: AchievementBadgeProps) => {
  const isUnlocked = progress?.isUnlocked ?? !!achievement.unlockedAt;
  const progressPercent = progress
    ? Math.min((progress.currentProgress / progress.requirement) * 100, 100)
    : isUnlocked
    ? 100
    : 0;

  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-20 h-20 text-3xl",
    lg: "w-24 h-24 text-4xl",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isUnlocked ? { scale: 1.05 } : {}}
    >
      {/* Badge circle */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative overflow-hidden ${
            isUnlocked
              ? "bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary shadow-lg"
              : "bg-muted border-2 border-border"
          }`}
          animate={isUnlocked ? { boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.3)", "0 0 20px 4px hsl(var(--primary) / 0.1)", "0 0 0 0 hsl(var(--primary) / 0.3)"] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Progress ring for locked achievements */}
          {!isUnlocked && showProgress && progressPercent > 0 && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth="4"
                strokeDasharray={`${progressPercent * 2.89} 289`}
              />
            </svg>
          )}

          {/* Icon or lock */}
          {isUnlocked ? (
            <span className="drop-shadow-sm">{achievement.icon}</span>
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </motion.div>

        {/* Unlocked sparkle */}
        {isUnlocked && (
          <motion.div
            className="absolute -top-1 -right-1 text-lg"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
        )}
      </div>

      {/* Name */}
      <p
        className={`font-medium text-center ${textSizes[size]} ${
          isUnlocked ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {achievement.name}
      </p>

      {/* Progress text for locked */}
      {!isUnlocked && showProgress && progress && (
        <p className="text-xs text-muted-foreground">
          {progress.currentProgress}/{progress.requirement}
        </p>
      )}
    </motion.div>
  );
};

export default AchievementBadge;
