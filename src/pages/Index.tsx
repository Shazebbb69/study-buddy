import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import GhostBuddy from "@/components/GhostBuddy";
import { useStudyTimer } from "@/hooks/useStudyTimer";

const Index = () => {
  const { theme, setTheme } = useTheme();

  const {
    formattedTime,
    status,
    todayMinutes,
    streak,
    focusDuration,
    durationOptions,
    setFocusDuration,
    startFocus,
    pause,
    resume,
    takeBreak,
    reset,
  } = useStudyTimer();

  const canEditDuration = status === "idle" || status === "break";

  const getStatusConfig = () => {
    switch (status) {
      case "focusing":
        return { text: "Focusing", className: "bg-primary/15 text-primary" };
      case "paused":
        return { text: "Paused", className: "bg-secondary/50 text-secondary-foreground" };
      case "completed":
        return {
          text: "Completed",
          className: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400",
        };
      case "break":
        return {
          text: "On Break",
          className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        };
      default:
        return { text: "Idle", className: "bg-muted text-muted-foreground" };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="theme-toggle fixed top-5 right-5 z-10"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-secondary-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-secondary-foreground" />
        )}
      </button>

      {/* Main Container */}
      <main className="app-container w-full max-w-md px-8 py-12 sm:px-12 sm:py-14 flex flex-col items-center">
        {/* Ghost Buddy */}
        <div className="mb-5">
          <GhostBuddy status={status} />
        </div>

        {/* Status Badge */}
        <div className={`status-badge mb-8 ${statusConfig.className}`}>
          {statusConfig.text}
        </div>

        {/* Timer */}
        <h1 className="timer-display text-6xl sm:text-7xl text-foreground mb-6">
          {formattedTime}
        </h1>

        {/* Duration Presets */}
        <div className="flex gap-2 mb-3">
          {durationOptions.map((duration) => (
            <button
              key={duration}
              onClick={() => setFocusDuration(duration)}
              disabled={!canEditDuration}
              className={`duration-btn ${
                focusDuration === duration
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
              } ${!canEditDuration ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {duration}m
            </button>
          ))}
        </div>

        {/* Custom Duration */}
        <div className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="number"
            min={5}
            disabled={!canEditDuration}
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded-md border bg-background text-center
                       disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <span>minutes</span>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-12">
          {status === "idle" || status === "break" || status === "completed" ? (
            <button onClick={startFocus} className="btn-primary">
              Start Focus
            </button>
          ) : status === "focusing" ? (
            <button onClick={pause} className="btn-secondary">
              Pause
            </button>
          ) : (
            <button onClick={resume} className="btn-primary">
              Resume
            </button>
          )}

          {(status === "focusing" || status === "paused" || status === "completed") && (
            <button onClick={reset} className="btn-secondary">
              Reset
            </button>
          )}

          {(status === "focusing" || status === "paused") && (
            <button onClick={takeBreak} className="btn-secondary">
              Take Break
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
          <p className="text-sm tracking-wide">
            Today:{" "}
            <span className="text-foreground font-medium">
              {todayMinutes} min
            </span>{" "}
            studied
          </p>

          {streak > 0 && (
            <p className="text-xs tracking-wide">
              Streak:{" "}
              <span className="text-primary font-medium">
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground/40 tracking-widest uppercase">
        Study Buddy
      </p>
    </div>
  );
};

export default Index;
