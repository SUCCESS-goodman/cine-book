import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import { validateEmail } from "./utils/validationPatterns.js";

const formStyles = {
  wrap: {
    maxWidth: 420,
    margin: "0 auto",
    padding: "40px 24px",
  },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" },
  sub: { textAlign: "center", opacity: 0.85, marginBottom: 24 },
  group: { marginBottom: 16 },
  label: { display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 15,
    boxSizing: "border-box",
  },
  error: { fontSize: 13, color: "#f87171", marginTop: 4 },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  btnPrimary: { background: "linear-gradient(90deg,#7c3aed,#a78bfa)", color: "#fff" },
  btnGoogle: { background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" },
  divider: { textAlign: "center", margin: "20px 0", opacity: 0.7 },
  link: { color: "#a78bfa", cursor: "pointer", textDecoration: "underline" },
};

export default function Login({ onSwitchToRegister, onSuccess }) {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  function runValidation() {
    const e = {};
    const emailErr = validateEmail(email);
    if (emailErr) e.email = emailErr;
    if (!password?.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");
    if (!runValidation()) return;
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      onSuccess?.();
    } catch (err) {
      setAuthError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setAuthError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (err) {
      setAuthError(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={formStyles.wrap}>
      <h1 style={formStyles.title}>Log in</h1>
      <p style={formStyles.sub}>Sign in to book movies and see your bookings</p>

      {authError && <p style={formStyles.error}>{authError}</p>}

      <form onSubmit={handleSubmit}>
        <div style={formStyles.group}>
          <label style={formStyles.label} htmlFor="login-email">Email *</label>
          <input
            id="login-email"
            type="email"
            style={formStyles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: null })); }}
          />
          {errors.email && <p style={formStyles.error}>{errors.email}</p>}
        </div>
        <div style={formStyles.group}>
          <label style={formStyles.label} htmlFor="login-password">Password *</label>
          <input
            id="login-password"
            type="password"
            style={formStyles.input}
            placeholder="Your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: null })); }}
          />
          {errors.password && <p style={formStyles.error}>{errors.password}</p>}
        </div>
        <button type="submit" style={{ ...formStyles.btn, ...formStyles.btnPrimary }} disabled={loading}>
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <div style={formStyles.divider}>— or —</div>
      <button type="button" style={{ ...formStyles.btn, ...formStyles.btnGoogle }} onClick={handleGoogle} disabled={loading}>
        Continue with Google
      </button>

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
        Don&apos;t have an account?{" "}
        <span style={formStyles.link} onClick={onSwitchToRegister} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onSwitchToRegister?.()}>
          Sign up
        </span>
      </p>
    </div>
  );
}
