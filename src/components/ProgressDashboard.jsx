import { getProgressPercent } from "../utils/scheduler";

const ProgressDashboard = ({ goals }) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => getProgressPercent(goal) === 100).length;
  const overallPercent =
    totalGoals === 0
      ? 0
      : Math.round(
          goals.reduce((sum, goal) => sum + getProgressPercent(goal), 0) / Math.max(totalGoals, 1)
        );

  return (
    <section className="panel">
      <h2>Progress Dashboard</h2>
      <div className="stats-grid">
        <article className="stat-card" style={{ "--delay": "80ms" }}>
          <p>Total Goals</p>
          <strong>{totalGoals}</strong>
        </article>
        <article className="stat-card" style={{ "--delay": "140ms" }}>
          <p>Completed Goals</p>
          <strong>{completedGoals}</strong>
        </article>
        <article className="stat-card" style={{ "--delay": "200ms" }}>
          <p>Overall Progress</p>
          <strong>{overallPercent}%</strong>
        </article>
      </div>

      <div className="progress-list">
        {goals.length === 0 ? (
          <p className="muted">Progress appears here once you add goals.</p>
        ) : (
          goals.map((goal, index) => {
            const percent = getProgressPercent(goal);
            return (
              <article
                key={goal.id}
                className="progress-item"
                style={{ "--delay": `${100 + index * 70}ms` }}
              >
                <header>
                  <h3>{goal.title}</h3>
                  <span>{percent}%</span>
                </header>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <p>
                  Completed: {goal.completedMinutes}/{goal.totalPlannedMinutes} min | Sessions:{" "}
                  {goal.completedSessions}/{goal.totalSessions}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default ProgressDashboard;
