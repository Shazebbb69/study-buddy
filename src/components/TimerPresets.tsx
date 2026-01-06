import { motion } from "framer-motion";

interface TimerPresetsProps {
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
  customMinutes: string;
  onCustomChange: (value: string) => void;
  disabled?: boolean;
}

const presets = [15, 30, 45, 60];

const TimerPresets = ({
  selectedMinutes,
  onSelect,
  customMinutes,
  onCustomChange,
  disabled = false,
}: TimerPresetsProps) => {
  const isCustomActive = !presets.includes(selectedMinutes);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preset buttons */}
      <div className="flex gap-2">
        {presets.map((minutes) => {
          const isActive = selectedMinutes === minutes && !isCustomActive;
          return (
            <motion.button
              key={minutes}
              onClick={() => onSelect(minutes)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
            >
              {minutes}m
            </motion.button>
          );
        })}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={customMinutes}
          onChange={(e) => onCustomChange(e.target.value)}
          disabled={disabled}
          min="1"
          max="180"
          className={`w-16 px-3 py-1.5 text-center text-sm rounded-full border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          placeholder="30"
        />
        <span className="text-sm text-muted-foreground">minutes</span>
      </div>
    </div>
  );
};

export default TimerPresets;
