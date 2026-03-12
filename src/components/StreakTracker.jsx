const toDisplayDate = (dateISO) => {
  if (!dateISO) {
    return "No sessions yet";
  }
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString();
};

const StreakTracker = ({ streak }) => {
  return (
    <section className="panel">
      <h2>Streak Tracker</h2>
      <div className="streak-strip">
        <article className="streak-card" style={{ "--delay": "80ms" }}>
          <p>Current Streak</p>
          <strong>{streak.current} days</strong>
        </article>
        <article className="streak-card" style={{ "--delay": "140ms" }}>
          <p>Longest Streak</p>
          <strong>{streak.longest} days</strong>
        </article>
        <article className="streak-card" style={{ "--delay": "200ms" }}>
          <p>Last Study Date</p>
          <strong>{toDisplayDate(streak.lastStudyDate)}</strong>
        </article>
      </div>
    </section>
  );
};

export default StreakTracker;
