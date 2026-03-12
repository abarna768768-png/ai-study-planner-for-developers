const sections = [
  { id: "overview", label: "Overview" },
  { id: "goals", label: "Goals" },
  { id: "schedule", label: "Schedule" },
  { id: "progress", label: "Progress" },
  { id: "streak", label: "Streak" }
];

const Sidebar = ({ activeSection, onChangeSection, userName, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="eyebrow">AI Planner</p>
        <h2>Study OS</h2>
        <p className="muted">Hi, {userName}</p>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? "sidebar-item active" : "sidebar-item"}
            onClick={() => onChangeSection(section.id)}
            style={{ "--delay": `${80 + index * 45}ms` }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <button type="button" className="ghost sidebar-logout" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
