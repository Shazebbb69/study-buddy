import { motion } from "framer-motion";
import { Timer, Clock } from "lucide-react";

export type StudyMode = "timer" | "stopwatch";

interface ModeToggleProps {
  mode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
  disabled?: boolean;
}

const ModeToggle = ({ mode, onModeChange, disabled = false }: ModeToggleProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex bg-secondary rounded-full p-1">
        {/* Background slider */}
        <motion.div
          className="absolute top-1 bottom-1 bg-primary rounded-full"
          initial={false}
          animate={{
            left: mode === "timer" ? "4px" : "calc(50% + 2px)",
            width: "calc(50% - 6px)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        
        {/* Timer button */}
        <button
          onClick={() => onModeChange("timer")}
          disabled={disabled}
          className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "timer" ? "text-primary-foreground" : "text-muted-foreground"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Timer className="w-4 h-4" />
          <span>Timer</span>
        </button>
        
        {/* Stopwatch button */}
        <button
          onClick={() => onModeChange("stopwatch")}
          disabled={disabled}
          className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "stopwatch" ? "text-primary-foreground" : "text-muted-foreground"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Clock className="w-4 h-4" />
          <span>Stopwatch</span>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
