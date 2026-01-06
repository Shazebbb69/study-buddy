import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Volume2, VolumeX, Bell, BellOff, X } from "lucide-react";
import { getPreferences, setSoundEnabled, setNotificationsEnabled } from "../utils/preferences";
import { requestNotificationPermission, hasNotificationSupport, getNotificationPermission } from "../utils/notifications";
import { initAudioContext, playStartSound } from "../utils/sounds";

interface SettingsPanelProps {
  onSoundChange?: (enabled: boolean) => void;
  onNotificationChange?: (enabled: boolean) => void;
}

const SettingsPanel = ({ onSoundChange, onNotificationChange }: SettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    setSoundOn(prefs.soundEnabled);
    setNotificationsOn(prefs.notificationsEnabled && getNotificationPermission() === "granted");
  }, []);

  const handleSoundToggle = () => {
    const newValue = !soundOn;
    setSoundOn(newValue);
    setSoundEnabled(newValue);
    onSoundChange?.(newValue);
    
    // Initialize audio context and play test sound
    if (newValue) {
      initAudioContext();
      playStartSound();
    }
  };

  const handleNotificationToggle = async () => {
    if (!hasNotificationSupport()) {
      return;
    }

    if (!notificationsOn) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotificationsOn(true);
        setNotificationsEnabled(true);
        onNotificationChange?.(true);
      }
    } else {
      setNotificationsOn(false);
      setNotificationsEnabled(false);
      onNotificationChange?.(false);
    }
  };

  return (
    <>
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-40 p-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-soft text-muted-foreground hover:text-foreground transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open settings"
      >
        <Settings size={20} />
      </motion.button>

      {/* Settings Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-6 left-6 z-50 w-72 bg-card rounded-2xl shadow-card border border-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Settings Options */}
              <div className="p-4 space-y-4">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {soundOn ? (
                      <Volume2 size={20} className="text-primary" />
                    ) : (
                      <VolumeX size={20} className="text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">Sound Effects</p>
                      <p className="text-xs text-muted-foreground">Subtle audio feedback</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleSoundToggle}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      soundOn ? "bg-primary" : "bg-muted"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: soundOn ? 28 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {notificationsOn ? (
                      <Bell size={20} className="text-primary" />
                    ) : (
                      <BellOff size={20} className="text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        {hasNotificationSupport() 
                          ? "Session alerts" 
                          : "Not supported"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleNotificationToggle}
                    disabled={!hasNotificationSupport()}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      notificationsOn ? "bg-primary" : "bg-muted"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileTap={hasNotificationSupport() ? { scale: 0.95 } : {}}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: notificationsOn ? 28 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Footer hint */}
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground text-center">
                  Your preferences are saved locally
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
