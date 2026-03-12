import { useMemo, useState } from "react";

const initialForm = {
  title: "",
  difficulty: "medium",
  targetDate: "",
  estimatedDailyMinutes: 60
};

const toDisplayDate = (dateISO) => {
  if (!dateISO) {
    return "N/A";
  }
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString();
};

const GoalManager = ({ goals, onAddGoal, onDeleteGoal }) => {
  const [form, setForm] = useState(initialForm);
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.targetDate) {
      return;
    }
    onAddGoal(form);
    setForm(initialForm);
  };

  return (
    <section className="panel">
      <h2>Learning Goals</h2>
      <form className="goal-form" onSubmit={handleSubmit}>
        <label>
          Goal Title
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Data Structures, React, Aptitude..."
            required
          />
        </label>
        <label>
          Difficulty
          <select
            value={form.difficulty}
            onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value }))}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label>
          Target Completion Date
          <input
            type="date"
            value={form.targetDate}
            min={minDate}
            onChange={(event) => setForm((prev) => ({ ...prev, targetDate: event.target.value }))}
            required
          />
        </label>
        <label>
          Estimated Daily Study (minutes)
          <input
            type="number"
            min="10"
            step="5"
            value={form.estimatedDailyMinutes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, estimatedDailyMinutes: Number(event.target.value) }))
            }
            required
          />
        </label>
        <button type="submit">Add Goal</button>
      </form>

      <div className="goal-list">
        {goals.length === 0 ? (
          <p className="muted">No goals yet. Add one to generate your plan.</p>
        ) : (
          goals.map((goal, index) => (
            <article
              key={goal.id}
              className="goal-item"
              style={{ "--delay": `${120 + index * 60}ms` }}
            >
              <div>
                <h3>{goal.title}</h3>
                <p>
                  {goal.difficulty.toUpperCase()} | Target: {toDisplayDate(goal.targetDate)}
                </p>
                <p>
                  Daily Estimate: {goal.estimatedDailyMinutes} min | Sessions: {goal.completedSessions}/
                  {goal.totalSessions}
                </p>
              </div>
              <button className="ghost danger" onClick={() => onDeleteGoal(goal.id)} type="button">
                Remove
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default GoalManager;
