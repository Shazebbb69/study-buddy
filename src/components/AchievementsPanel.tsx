import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { ACHIEVEMENTS } from "../types/achievements";
import { getAchievementsProgress, getUnlockedAchievements } from "../utils/achievements";
import AchievementBadge from "./AchievementBadge";

const AchievementsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unlocked">("all");
  const [progress, setProgress] = useState(getAchievementsProgress());
  const [unlockedCount, setUnlockedCount] = useState(getUnlockedAchievements().length);

  // Update on mount and when panel opens
  useEffect(() => {
    const updateProgress = () => {
      setProgress(getAchievementsProgress());
      setUnlockedCount(getUnlockedAchievements().length);
    };
    
    updateProgress();
    
    // Listen for storage changes (for when achievements are unlocked)
    const handleStorage = () => updateProgress();
    window.addEventListener("storage", handleStorage);
    
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setProgress(getAchievementsProgress());
      setUnlockedCount(getUnlockedAchievements().length);
    }
  }, [isOpen]);

  const categories = [
    { id: "sessions", label: "Sessions", icon: "🎯" },
    { id: "time", label: "Time", icon: "⏱️" },
    { id: "consistency", label: "Streaks", icon: "🔥" },
    { id: "focus", label: "Focus", icon: "🧠" },
  ] as const;

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-16 z-40 p-3 rounded-full bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="View achievements"
      >
        <Trophy className="w-5 h-5 text-primary" />
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {unlockedCount}
          </span>
        )}
      </motion.button>

      {/* Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 overflow-hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Achievements
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {unlockedCount} of {ACHIEVEMENTS.length} unlocked
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-4 border-b border-border">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  All Badges
                </button>
                <button
                  onClick={() => setActiveTab("unlocked")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "unlocked"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Unlocked ({unlockedCount})
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "all" ? (
                  <div className="space-y-8">
                    {categories.map((category) => {
                      const categoryAchievements = ACHIEVEMENTS.filter(
                        (a) => a.category === category.id
                      );
                      return (
                        <div key={category.id}>
                          <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.label}
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            {categoryAchievements.map((achievement) => {
                              const achievementProgress = progress.find(
                                (p) => p.id === achievement.id
                              );
                              return (
                                <AchievementBadge
                                  key={achievement.id}
                                  achievement={achievement}
                                  progress={achievementProgress}
                                  size="sm"
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {ACHIEVEMENTS.filter((a) =>
                      progress.find((p) => p.id === a.id)?.isUnlocked
                    ).map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        progress={progress.find((p) => p.id === achievement.id)}
                        size="sm"
                        showProgress={false}
                      />
                    ))}
                    {unlockedCount === 0 && (
                      <div className="col-span-3 text-center py-12 text-muted-foreground">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No achievements unlocked yet.</p>
                        <p className="text-sm mt-1">Start studying to earn badges!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementsPanel;
