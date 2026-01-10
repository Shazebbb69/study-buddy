import { motion } from "framer-motion";

interface StopwatchProps {
  seconds: number;
  isRunning: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Stopwatch = ({ seconds, isRunning }: StopwatchProps) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Stopwatch display with glow effect */}
      <motion.div
        className={`text-7xl sm:text-8xl font-light tracking-tight text-foreground tabular-nums p-6 rounded-3xl ${
          isRunning ? "timer-glow" : ""
        }`}
        animate={{
          opacity: isRunning ? 1 : 0.9,
          scale: isRunning ? 1 : 0.98,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          key={seconds}
          initial={{ opacity: 0.8, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {formatTime(seconds)}
        </motion.span>
      </motion.div>

      {/* Running indicator */}
      {isRunning && (
        <motion.div 
          className="absolute -bottom-6 flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Stopwatch;
