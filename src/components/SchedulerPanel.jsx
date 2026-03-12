const SchedulerPanel = ({ dailySchedule, dailyAvailableMinutes, onDailyMinutesChange, onCompleteTask }) => {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Today&apos;s Smart Schedule</h2>
        <label className="inline-field">
          Daily Time (min)
          <input
            type="number"
            min="15"
            step="5"
            value={dailyAvailableMinutes}
            onChange={(event) => onDailyMinutesChange(Number(event.target.value))}
          />
        </label>
      </div>

      {dailySchedule.length === 0 ? (
        <p className="muted">No pending tasks. Add goals or complete overdue sessions to replan.</p>
      ) : (
        <div className="schedule-list">
          {dailySchedule.map((task, index) => (
            <article
              key={task.goalId}
              className={`schedule-item ${task.overdue ? "overdue" : ""}`}
              style={{ "--delay": `${120 + index * 70}ms` }}
            >
              <div>
                <h3>{task.title}</h3>
                <p>
                  Focus: {task.minutes} min | Difficulty: {task.difficulty.toUpperCase()} | Days left:{" "}
                  {task.daysLeft}
                </p>
                {task.overdue ? <span className="badge danger">Deadline passed</span> : null}
              </div>
              <button onClick={() => onCompleteTask(task)} type="button">
                Mark Session Complete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default SchedulerPanel;
