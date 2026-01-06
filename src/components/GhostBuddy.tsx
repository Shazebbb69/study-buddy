import { motion, AnimatePresence } from "framer-motion";

export type GhostState = "idle" | "focusing" | "paused" | "completed";

interface GhostBuddyProps {
  size?: "sm" | "md" | "lg";
  state?: GhostState;
  showLabel?: boolean;
  message?: string;
}

const sizeMap = {
  sm: { ghost: 80, wrapper: "w-20 h-20" },
  md: { ghost: 120, wrapper: "w-32 h-32" },
  lg: { ghost: 160, wrapper: "w-44 h-44" },
};

const stateLabels: Record<GhostState, string> = {
  idle: "Idle",
  focusing: "Focusing",
  paused: "Paused",
  completed: "Done!",
};

const stateAnimations = {
  idle: {
    body: { y: [0, -6, 0] },
    bodyTransition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
  focusing: {
    body: { y: [0, -4, 0], scale: [1, 1.02, 1] },
    bodyTransition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
  paused: {
    body: { rotate: [-1, 1, -1] },
    bodyTransition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
  },
  completed: {
    body: { y: [0, -12, 0], rotate: [0, 3, -3, 0] },
    bodyTransition: { duration: 0.6, repeat: 2, ease: "easeOut" as const },
  },
};

const GhostBuddy = ({ size = "md", state = "idle", showLabel = true, message }: GhostBuddyProps) => {
  const dimensions = sizeMap[size];
  const animations = stateAnimations[state];

  // Determine eye and mouth expressions based on state
  const getEyeStyle = () => {
    switch (state) {
      case "focusing":
        return { cy: 42, ry: 5 }; // Slightly squinted
      case "paused":
        return { cy: 44, ry: 3 }; // Sleepy/droopy
      case "completed":
        return { cy: 40, ry: 6 }; // Wide and happy
      default:
        return { cy: 42, ry: 5 }; // Normal
    }
  };

  const getMouthPath = () => {
    switch (state) {
      case "idle":
        return "M38 58 Q50 65 62 58"; // Gentle smile
      case "focusing":
        return "M40 60 Q50 60 60 60"; // Neutral/focused
      case "paused":
        return "M40 62 Q50 58 60 62"; // Slight frown
      case "completed":
        return "M35 55 Q50 70 65 55"; // Big happy smile
      default:
        return "M38 58 Q50 65 62 58";
    }
  };

  const eyeStyle = getEyeStyle();

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={`${dimensions.wrapper} relative`}
        animate={animations.body}
        transition={animations.bodyTransition}
      >
        {/* Ghost SVG */}
        <svg
          width={dimensions.ghost}
          height={dimensions.ghost}
          viewBox="0 0 100 100"
          fill="none"
          className="w-full h-full"
        >
          {/* Ghost body */}
          <motion.path
            d="M50 8C28 8 12 26 12 48V85C12 85 20 78 28 85C36 92 44 78 50 85C56 92 64 78 72 85C80 92 88 78 88 85V48C88 26 72 8 50 8Z"
            className="fill-muted stroke-muted-foreground/30"
            strokeWidth="1.5"
          />
          
          {/* Left eye */}
          <motion.ellipse
            cx="35"
            cy={eyeStyle.cy}
            rx="5"
            ry={eyeStyle.ry}
            className="fill-muted-foreground"
            animate={state === "paused" ? { scaleY: [1, 0.3, 0.3, 1] } : {}}
            transition={state === "paused" ? { duration: 3, repeat: Infinity, times: [0, 0.1, 0.9, 1] } : {}}
          />
          
          {/* Right eye */}
          <motion.ellipse
            cx="65"
            cy={eyeStyle.cy}
            rx="5"
            ry={eyeStyle.ry}
            className="fill-muted-foreground"
            animate={state === "paused" ? { scaleY: [1, 0.3, 0.3, 1] } : {}}
            transition={state === "paused" ? { duration: 3, repeat: Infinity, times: [0, 0.1, 0.9, 1], delay: 0.1 } : {}}
          />
          
          {/* Mouth */}
          <AnimatePresence mode="wait">
            <motion.path
              key={state}
              d={getMouthPath()}
              className="stroke-muted-foreground"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>

          {/* Blush for completed state */}
          {state === "completed" && (
            <>
              <motion.circle
                cx="25"
                cy="52"
                r="4"
                className="fill-primary/20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              />
              <motion.circle
                cx="75"
                cy="52"
                r="4"
                className="fill-primary/20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              />
            </>
          )}
        </svg>

        {/* Celebration particles for completed */}
        {state === "completed" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{ left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 30 - 15,
                  opacity: 0,
                  scale: [1, 0],
                }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* State label */}
      {showLabel && (
        <motion.span
          key={state}
          className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {stateLabels[state]}
        </motion.span>
      )}

      {/* Message */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            className="text-muted-foreground text-center text-sm italic max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            "{message}"
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GhostBuddy;
