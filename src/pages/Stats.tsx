import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Target, TrendingUp, Calendar } from "lucide-react";
import GhostBuddy from "../components/GhostBuddy";
import ThemeToggle from "../components/ThemeToggle";
import DailyGoal from "../components/DailyGoal";
import { getTotalTime, getTotalSessions, getSessions } from "../utils/storage";
import { formatDuration } from "../utils/time";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  delay: number;
}

const StatCard = ({ icon, label, value, description, delay }: StatCardProps) => (
  <motion.div
    className="p-6 bg-card rounded-2xl shadow-soft border border-border"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.02, y: -2 }}
  >
    <div className="flex items-start gap-4">
      <motion.div
        className="p-3 rounded-xl bg-primary/10 text-primary"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        {icon}
      </motion.div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  </motion.div>
);

const Stats: React.FC = () => {
  const [totalTime, setTotalTime] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [avgSession, setAvgSession] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);

  useEffect(() => {
    const time = getTotalTime();
    const sessions = getTotalSessions();
    const allSessions = getSessions();

    setTotalTime(time);
    setTotalSessions(sessions);
    setAvgSession(sessions > 0 ? Math.round(time / sessions) : 0);

    const today = new Date().toDateString();
    const todayData = allSessions.filter((s) => new Date(s.date).toDateString() === today);
    setTodaySessions(todayData.length);
    setTodayMinutes(Math.floor(todayData.reduce((acc, s) => acc + s.duration, 0) / 60));
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <ThemeToggle />
      <motion.div className="min-h-screen px-6 py-12 pb-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="max-w-md mx-auto">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Your Progress</h1>
            <p className="text-muted-foreground">Track your study journey</p>
          </motion.div>

          <DailyGoal currentMinutes={todayMinutes} />

          <div className="space-y-4">
            <StatCard icon={<Clock size={24} />} label="Total Study Time" value={formatDuration(totalTime)} description="Keep it up!" delay={0.2} />

            <StatCard
              icon={<Target size={24} />}
              label="Total Sessions"
              value={totalSessions.toString()}
              description={`${todaySessions} session${todaySessions !== 1 ? "s" : ""} today`}
              delay={0.2}
            />

            <StatCard icon={<TrendingUp size={24} />} label="Average Session" value={formatDuration(avgSession)} description="Per study session" delay={0.3} />

            <StatCard icon={<Calendar size={24} />} label="Today's Sessions" value={todaySessions.toString()} description={todaySessions > 0 ? "Great progress!" : "Start your first session"} delay={0.4} />
          </div>

          {totalSessions === 0 && (
            <motion.div className="text-center mt-12 p-8 bg-card rounded-2xl shadow-soft" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
              <GhostBuddy size="sm" message="Start studying to see your progress here!" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;