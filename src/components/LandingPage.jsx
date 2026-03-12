const LandingPage = ({ onStartPlanning, onGoToLogin }) => {
  return (
    <main className="entry-shell">
      <section className="landing-hero">
        <p className="eyebrow">Developer Learning System</p>
        <h1>Plan Interview Prep Like a Product Sprint</h1>
        <p>
          AI Study Planner builds your daily coding roadmap based on difficulty, deadlines, and available
          time, then tracks progress and streak consistency automatically.
        </p>
        <div className="entry-actions">
          <button type="button" onClick={onGoToLogin}>
            Login
          </button>
          <button type="button" className="ghost" onClick={onStartPlanning}>
            Continue as Guest
          </button>
        </div>
      </section>

      <section className="feature-band">
        <article className="feature-card" style={{ "--delay": "120ms" }}>
          <h3>Goal Engine</h3>
          <p>Add learning topics with target dates and study budgets.</p>
        </article>
        <article className="feature-card" style={{ "--delay": "200ms" }}>
          <h3>Smart Scheduler</h3>
          <p>Rule-based priority logic allocates your daily minutes dynamically.</p>
        </article>
        <article className="feature-card" style={{ "--delay": "280ms" }}>
          <h3>Habit Tracker</h3>
          <p>Progress bars and streak stats keep consistency visible every day.</p>
        </article>
      </section>
    </main>
  );
};

export default LandingPage;
