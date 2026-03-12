const MS_PER_DAY = 24 * 60 * 60 * 1000;
const FIVE_MINUTES = 5;

const difficultyWeights = {
  easy: 1,
  medium: 1.3,
  hard: 1.65
};

const normalizeDate = (dateInput) => {
  const date = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : new Date(dateInput);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getTodayISO = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const daysUntil = (targetDate, fromDate = getTodayISO()) => {
  const start = normalizeDate(fromDate);
  const end = normalizeDate(targetDate);
  return Math.floor((end - start) / MS_PER_DAY);
};

export const roundToFive = (minutes) => Math.round(minutes / FIVE_MINUTES) * FIVE_MINUTES;

const getGoalPriority = (goal, todayISO) => {
  const remainingMinutes = Math.max(goal.totalPlannedMinutes - goal.completedMinutes, 0);
  const rawDaysLeft = daysUntil(goal.targetDate, todayISO);
  const daysLeft = Math.max(rawDaysLeft + 1, 1);
  const urgency = 1 + 3 / daysLeft;
  const dailyNeed = remainingMinutes / daysLeft;
  const difficulty = difficultyWeights[goal.difficulty] ?? 1;
  const priorityScore = dailyNeed * urgency * difficulty;

  return {
    ...goal,
    daysLeft,
    overdue: rawDaysLeft < 0,
    remainingMinutes,
    priorityScore
  };
};

const distributeBudget = (items, budgetMinutes) => {
  if (!items.length || budgetMinutes <= 0) {
    return [];
  }

  const initial = items.map((item) => {
    const scoreShare = item.priorityScore / items.reduce((acc, current) => acc + current.priorityScore, 0);
    const rawMinutes = scoreShare * budgetMinutes;
    const rounded = Math.max(FIVE_MINUTES, roundToFive(rawMinutes));

    return {
      ...item,
      allocatedMinutes: Math.min(item.remainingMinutes, rounded)
    };
  });

  const allocatedTotal = initial.reduce((sum, item) => sum + item.allocatedMinutes, 0);
  let adjustment = budgetMinutes - allocatedTotal;

  const byPriority = [...initial].sort((a, b) => b.priorityScore - a.priorityScore);

  while (Math.abs(adjustment) >= FIVE_MINUTES) {
    let changed = false;

    for (const item of byPriority) {
      if (adjustment > 0) {
        const candidate = initial.find((entry) => entry.id === item.id);
        if (!candidate) {
          continue;
        }
        const available = candidate.remainingMinutes - candidate.allocatedMinutes;
        if (available >= FIVE_MINUTES) {
          candidate.allocatedMinutes += FIVE_MINUTES;
          adjustment -= FIVE_MINUTES;
          changed = true;
        }
      } else if (adjustment < 0) {
        const candidate = initial.find((entry) => entry.id === item.id);
        if (!candidate) {
          continue;
        }
        if (candidate.allocatedMinutes > FIVE_MINUTES) {
          candidate.allocatedMinutes -= FIVE_MINUTES;
          adjustment += FIVE_MINUTES;
          changed = true;
        }
      }

      if (Math.abs(adjustment) < FIVE_MINUTES) {
        break;
      }
    }

    if (!changed) {
      break;
    }
  }

  return initial.filter((item) => item.allocatedMinutes > 0);
};

export const generateTodaySchedule = (goals, dailyAvailableMinutes, todayISO = getTodayISO()) => {
  const eligibleGoals = goals
    .map((goal) => getGoalPriority(goal, todayISO))
    .filter((goal) => goal.remainingMinutes > 0);

  if (!eligibleGoals.length) {
    return [];
  }

  const budget = Math.max(roundToFive(Number(dailyAvailableMinutes) || 0), FIVE_MINUTES);
  const distributed = distributeBudget(eligibleGoals, budget);

  return distributed
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((goal) => ({
      goalId: goal.id,
      title: goal.title,
      minutes: goal.allocatedMinutes,
      daysLeft: goal.daysLeft,
      overdue: goal.overdue,
      difficulty: goal.difficulty
    }));
};

export const buildNewGoal = ({ title, difficulty, targetDate, estimatedDailyMinutes }) => {
  const todayISO = getTodayISO();
  const daysAvailable = Math.max(daysUntil(targetDate, todayISO) + 1, 1);
  const parsedEstimated = Math.max(Number(estimatedDailyMinutes) || 30, 10);
  const totalPlannedMinutes = parsedEstimated * daysAvailable;

  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    title: title.trim(),
    difficulty,
    targetDate,
    estimatedDailyMinutes: parsedEstimated,
    totalPlannedMinutes,
    completedMinutes: 0,
    totalSessions: daysAvailable,
    completedSessions: 0,
    createdAt: new Date().toISOString(),
    lastStudiedDate: null
  };
};

export const completeGoalSession = (goal, completedMinutes, todayISO = getTodayISO()) => {
  const nextCompletedMinutes = Math.min(goal.completedMinutes + completedMinutes, goal.totalPlannedMinutes);
  const nextCompletedSessions = Math.min(goal.completedSessions + 1, goal.totalSessions);

  return {
    ...goal,
    completedMinutes: nextCompletedMinutes,
    completedSessions: nextCompletedSessions,
    lastStudiedDate: todayISO
  };
};

export const getProgressPercent = (goal) => {
  if (!goal.totalPlannedMinutes) {
    return 0;
  }
  return Math.min(100, Math.round((goal.completedMinutes / goal.totalPlannedMinutes) * 100));
};

export const calculateStreakAfterStudy = (streak, studyDateISO) => {
  if (!studyDateISO) {
    return streak;
  }

  if (!streak.lastStudyDate) {
    return {
      current: 1,
      longest: Math.max(streak.longest, 1),
      lastStudyDate: studyDateISO
    };
  }

  const diff = daysUntil(studyDateISO, streak.lastStudyDate);

  if (diff === 0) {
    return streak;
  }

  if (diff === 1) {
    const nextCurrent = streak.current + 1;
    return {
      current: nextCurrent,
      longest: Math.max(streak.longest, nextCurrent),
      lastStudyDate: studyDateISO
    };
  }

  return {
    current: 1,
    longest: Math.max(streak.longest, 1),
    lastStudyDate: studyDateISO
  };
};

export const normalizeStreakForToday = (streak, todayISO = getTodayISO()) => {
  if (!streak.lastStudyDate) {
    return streak;
  }

  const diff = daysUntil(todayISO, streak.lastStudyDate);
  if (diff > 1 && streak.current !== 0) {
    return {
      ...streak,
      current: 0
    };
  }

  return streak;
};
