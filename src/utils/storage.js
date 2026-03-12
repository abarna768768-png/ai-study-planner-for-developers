const KEYS = {
  goals: "ai-study-planner:goals",
  settings: "ai-study-planner:settings",
  sessions: "ai-study-planner:sessions",
  streak: "ai-study-planner:streak",
  auth: "ai-study-planner:auth"
};

const DEFAULT_SETTINGS = {
  dailyAvailableMinutes: 120
};

const DEFAULT_STREAK = {
  current: 0,
  longest: 0,
  lastStudyDate: null
};

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const loadGoals = () => safeParse(localStorage.getItem(KEYS.goals), []);

export const saveGoals = (goals) => {
  localStorage.setItem(KEYS.goals, JSON.stringify(goals));
};

export const loadSettings = () => {
  const settings = safeParse(localStorage.getItem(KEYS.settings), DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...settings
  };
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
};

export const loadSessions = () => safeParse(localStorage.getItem(KEYS.sessions), []);

export const saveSessions = (sessions) => {
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
};

export const loadStreak = () => {
  const streak = safeParse(localStorage.getItem(KEYS.streak), DEFAULT_STREAK);
  return {
    ...DEFAULT_STREAK,
    ...streak
  };
};

export const saveStreak = (streak) => {
  localStorage.setItem(KEYS.streak, JSON.stringify(streak));
};

export const loadAuthUser = () => safeParse(localStorage.getItem(KEYS.auth), null);

export const saveAuthUser = (authUser) => {
  if (!authUser) {
    localStorage.removeItem(KEYS.auth);
    return;
  }
  localStorage.setItem(KEYS.auth, JSON.stringify(authUser));
};
