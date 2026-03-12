import { useState } from "react";

const LoginPage = ({ onLogin, onBack }) => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      return;
    }
    onLogin(form);
  };

  return (
    <main className="entry-shell">
      <section className="login-card">
        <p className="eyebrow">Welcome Back</p>
        <h1>Sign In</h1>
        <p className="muted">Access your saved study goals and continue your streak.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Enter password"
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>

        <div className="entry-actions">
          <button type="button" className="ghost" onClick={onBack}>
            Back
          </button>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
