import { forwardRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Clock, BarChart3, LogOut, LogIn } from "lucide-react";
import { isLoggedIn, logout } from "../utils/auth";

const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/study", icon: Clock, label: "Study" },
    { path: "/stats", icon: BarChart3, label: "Stats" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      ref={ref}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-card/90 backdrop-blur-lg rounded-2xl shadow-card border border-border">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 gradient-primary rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10 text-sm font-medium hidden sm:block">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Auth button */}
        {loggedIn ? (
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium hidden sm:block">Logout</span>
          </motion.button>
        ) : (
          <Link to="/login">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={18} />
              <span className="text-sm font-medium hidden sm:block">Login</span>
            </motion.div>
          </Link>
        )}
      </div>
    </motion.nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
