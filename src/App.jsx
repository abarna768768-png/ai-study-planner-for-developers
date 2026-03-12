import { useEffect, useMemo, useState } from "react";
import GoalManager from "./components/GoalManager";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SchedulerPanel from "./components/SchedulerPanel";
import Sidebar from "./components/Sidebar";
import ProgressDashboard from "./components/ProgressDashboard";
import StreakTracker from "./components/StreakTracker";
import {
  buildNewGoal,
  calculateStreakAfterStudy,
  completeGoalSession,
  generateTodaySchedule,
  getTodayISO,
  normalizeStreakForToday
} from "./utils/scheduler";
import {
  loadGoals,
  loadSessions,
  loadSettings,
  loadStreak,
  loadAuthUser,
  saveAuthUser,
  saveGoals,
  saveSessions,
  saveSettings,
  saveStreak
} from "./utils/storage";

const sectionCopy = {
  overview: {
    title: "Daily Control Center",
    subtitle: "Your complete planner view with goals, schedule, progress, and streak."
  },
  goals: {
    title: "Goal Manager",
    subtitle: "Define new learning goals and manage your roadmap."
  },
  schedule: {
    title: "Smart Schedule",
    subtitle: "Focus on the highest-priority topics for today."
  },
  progress: {
    title: "Progress Dashboard",
    subtitle: "Track completion percentages and learning momentum."
  },
  streak: {
    title: "Streak Tracker",
    subtitle: "Build consistency with consecutive-day study habits."
  }
};

const App = () => {
  const [goals, setGoals] = useState(() => loadGoals());
  const [sessions, setSessions] = useState(() => loadSessions());
  const [settings, setSettings] = useState(() => loadSettings());
  const [streak, setStreak] = useState(() => loadStreak());
  const [authUser, setAuthUser] = useState(() => loadAuthUser());
  const [route, setRoute] = useState(() => (loadAuthUser() ? "dashboard" : "landing"));
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    setStreak((prev) => normalizeStreakForToday(prev, getTodayISO()));
  }, []);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStreak(streak);
  }, [streak]);

  useEffect(() => {
    saveAuthUser(authUser);
  }, [authUser]);

  const todaySchedule = useMemo(
    () => generateTodaySchedule(goals, settings.dailyAvailableMinutes),
    [goals, settings.dailyAvailableMinutes]
  );

  const handleAddGoal = (goalInput) => {
    const goal = buildNewGoal(goalInput);
    setGoals((prev) => [...prev, goal]);
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  const handleCompleteTask = (task) => {
    const todayISO = getTodayISO();

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== task.goalId) {
          return goal;
        }
        return completeGoalSession(goal, task.minutes, todayISO);
      })
    );

    setSessions((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        goalId: task.goalId,
        title: task.title,
        minutes: task.minutes,
        completedAt: new Date().toISOString()
      }
    ]);

    setStreak((prev) => calculateStreakAfterStudy(prev, todayISO));
  };

  const handleDailyMinutesChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      dailyAvailableMinutes: Math.max(15, Number(value) || 15)
    }));
  };

  const handleGuestStart = () => {
    setAuthUser({
      name: "Guest Developer",
      email: null
    });
    setRoute("dashboard");
  };

  const handleLogin = ({ email }) => {
    const guessedName = email.split("@")[0]?.trim() || "Developer";
    const cleanName = guessedName.charAt(0).toUpperCase() + guessedName.slice(1);
    setAuthUser({
      name: cleanName,
      email
    });
    setRoute("dashboard");
  };

  const handleLogout = () => {
    setAuthUser(null);
    setRoute("landing");
    setActiveSection("overview");
  };

  if (route === "landing") {
    return (
      <LandingPage
        onGoToLogin={() => setRoute("login")}
        onStartPlanning={handleGuestStart}
      />
    );
  }

  if (route === "login") {
    return <LoginPage onLogin={handleLogin} onBack={() => setRoute("landing")} />;
  }

  const currentSection = sectionCopy[activeSection] ?? sectionCopy.overview;

  return (
    <main className="dashboard-shell">
      <Sidebar
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        userName={authUser?.name || "Developer"}
        onLogout={handleLogout}
      />

      <section className="dashboard-content">
        <header className="hero">
          <p className="eyebrow">AI Study Planner For Developers</p>
          <h1>{currentSection.title}</h1>
          <p>{currentSection.subtitle}</p>
        </header>

        <div className="section-stage" key={activeSection}>
          {activeSection === "overview" ? (
            <>
              <section className="grid-layout">
                <GoalManager goals={goals} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} />
                <SchedulerPanel
                  dailySchedule={todaySchedule}
                  dailyAvailableMinutes={settings.dailyAvailableMinutes}
                  onDailyMinutesChange={handleDailyMinutesChange}
                  onCompleteTask={handleCompleteTask}
                />
              </section>

              <section className="grid-layout secondary">
                <ProgressDashboard goals={goals} />
                <StreakTracker streak={streak} />
              </section>
            </>
          ) : null}

          {activeSection === "goals" ? (
            <GoalManager goals={goals} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} />
          ) : null}

          {activeSection === "schedule" ? (
            <SchedulerPanel
              dailySchedule={todaySchedule}
              dailyAvailableMinutes={settings.dailyAvailableMinutes}
              onDailyMinutesChange={handleDailyMinutesChange}
              onCompleteTask={handleCompleteTask}
            />
          ) : null}

          {activeSection === "progress" ? <ProgressDashboard goals={goals} /> : null}

          {activeSection === "streak" ? <StreakTracker streak={streak} /> : null}
        </div>
      </section>
    </main>
  );
};

export default App;
