import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "../types/achievements";
import { X } from "lucide-react";

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-4 left-1/2 z-50 pointer-events-auto"
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -100, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="bg-card border-2 border-primary rounded-2xl shadow-card p-4 pr-10 flex items-center gap-4 min-w-[280px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Icon with animation */}
            <motion.div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-3xl"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
            >
              {achievement.icon}
            </motion.div>

            {/* Text content */}
            <div className="flex-1">
              <motion.p
                className="text-xs font-medium text-primary uppercase tracking-wider mb-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Achievement Unlocked!
              </motion.p>
              <motion.p
                className="font-semibold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.name}
              </motion.p>
              <motion.p
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {achievement.description}
              </motion.p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Confetti particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(${270 + i * 20} 70% 60%)`,
                  left: `${20 + i * 12}%`,
                }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -30 - Math.random() * 20],
                  x: [0, (Math.random() - 0.5) * 40],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  delay: 0.3 + i * 0.1,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementToast;
