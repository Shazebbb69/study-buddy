import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, Edit2 } from "lucide-react";
import { getPreferences, savePreferences } from "../utils/preferences";

interface DailyGoalProps {
  currentMinutes: number;
}

const DailyGoal = ({ currentMinutes }: DailyGoalProps) => {
  const [goalMinutes, setGoalMinutes] = useState(60);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("60");

  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.dailyGoalMinutes) {
      setGoalMinutes(prefs.dailyGoalMinutes);
      setInputValue(prefs.dailyGoalMinutes.toString());
    }
  }, []);

  const progress = Math.min((currentMinutes / goalMinutes) * 100, 100);
  const isComplete = currentMinutes >= goalMinutes;

  const handleSave = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num >= 1 && num <= 720) {
      setGoalMinutes(num);
      const prefs = getPreferences();
      savePreferences({ ...prefs, dailyGoalMinutes: num });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <motion.div
      className="p-6 bg-card rounded-2xl shadow-soft border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isComplete ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
            {isComplete ? <Check size={20} /> : <Target size={20} />}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Daily Goal</p>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    autoFocus
                    min={1}
                    max={720}
                    className="w-16 px-2 py-1 text-lg font-semibold bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </motion.div>
              ) : (
                <motion.p
                  key="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-semibold text-foreground"
                >
                  {currentMinutes} / {goalMinutes} min
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        {!isEditing && (
          <motion.button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit2 size={16} />
          </motion.button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {isComplete && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 hsl(var(--primary) / 0)",
                "0 0 0 4px hsl(var(--primary) / 0.3)",
                "0 0 0 0 hsl(var(--primary) / 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Motivational message */}
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.p
            key="complete"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-primary font-medium mt-3 text-center"
          >
            🎉 Goal achieved! You're amazing!
          </motion.p>
        ) : progress >= 75 ? (
          <motion.p
            key="almost"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground mt-3 text-center"
          >
            Almost there! Keep going! 💪
          </motion.p>
        ) : progress >= 50 ? (
          <motion.p
            key="halfway"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground mt-3 text-center"
          >
            Halfway done! You're doing great! ✨
          </motion.p>
        ) : progress > 0 ? (
          <motion.p
            key="started"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground mt-3 text-center"
          >
            Good start! Keep the momentum! 🚀
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyGoal;
