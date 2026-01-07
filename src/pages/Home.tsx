import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import GhostBuddy from "../components/GhostBuddy";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <GhostBuddy size="lg" message="I'm here. Let's focus together." />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            StudyBuddy
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your calm companion for focused study sessions. Track your progress, one moment at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button onClick={() => navigate("/study")}>
              <Sparkles size={20} />
              Start Studying
            </Button>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Focus better. Learn more. Feel accomplished.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;