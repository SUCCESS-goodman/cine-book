import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import { validateEmail, validatePassword } from "./utils/validationPatterns.js";

const COOKIE_CONSENT_NAME = "cinebook_cookie_consent";
const COOKIE_CONSENT_HOURS = 2;

function setCookieConsent() {
  const maxAge = COOKIE_CONSENT_HOURS * 60 * 60;
  document.cookie = `${COOKIE_CONSENT_NAME}=accepted; max-age=${maxAge}; path=/; SameSite=Lax`;
}

const formStyles = {
  wrap: {
    maxWidth: 420,
    margin: "0 auto",
    padding: "40px 24px",
  },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" },
  sub: { textAlign: "center", opacity: 0.85, marginBottom: 24 },
  form: {},
  group: { marginBottom: 16 },
  label: { display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 },
  checkboxRow: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 },
  checkbox: { marginTop: 4, width: 18, height: 18, cursor: "pointer", accentColor: "#8b5cf6" },
  checkboxLabel: { fontSize: 14, opacity: 0.9, lineHeight: 1.4, cursor: "pointer" },
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

export default function Register({ onSwitchToLogin, onSuccess }) {
  const { signUpWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [acceptCookies, setAcceptCookies] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  function runValidation() {
    const e = {};
    const emailErr = validateEmail(email);
    if (emailErr) e.email = emailErr;
    const passErr = validatePassword(password);
    if (passErr) e.password = passErr;
    if (!acceptCookies) e.cookies = "Please accept cookies to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");
    if (!runValidation()) return;
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, displayName.trim() || null);
      setCookieConsent();
      onSuccess?.();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      setAuthError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setAuthError("");
    if (!acceptCookies) {
      setErrors((p) => ({ ...p, cookies: "Please accept cookies to continue." }));
      return;
    }
    setLoading(true);
    try {
      await loginWithGoogle();
      setCookieConsent();
      onSuccess?.();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      setAuthError(err.message || "Google sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={formStyles.wrap}>
      <h1 style={formStyles.title}>Sign up</h1>
      <p style={formStyles.sub}>Create an account to book movies</p>

      {authError && <p style={formStyles.error}>{authError}</p>}

      <form onSubmit={handleSubmit} style={formStyles.form}>
        <div style={formStyles.group}>
          <label style={formStyles.label} htmlFor="reg-name">Display name (optional)</label>
          <input
            id="reg-name"
            type="text"
            style={formStyles.input}
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div style={formStyles.group}>
          <label style={formStyles.label} htmlFor="reg-email">Email *</label>
          <input
            id="reg-email"
            type="email"
            style={formStyles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: null })); }}
          />
          {errors.email && <p style={formStyles.error}>{errors.email}</p>}
        </div>
        <div style={formStyles.group}>
          <label style={formStyles.label} htmlFor="reg-password">Password *</label>
          <input
            id="reg-password"
            type="password"
            style={formStyles.input}
            placeholder="Min 8 chars, letter + number"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: null })); }}
          />
          {errors.password && <p style={formStyles.error}>{errors.password}</p>}
        </div>
        <div style={formStyles.checkboxRow}>
          <input
            id="reg-cookies"
            type="checkbox"
            style={formStyles.checkbox}
            checked={acceptCookies}
            onChange={(e) => { setAcceptCookies(e.target.checked); setErrors((p) => ({ ...p, cookies: null })); }}
            aria-describedby="reg-cookies-err"
          />
          <label style={formStyles.checkboxLabel} htmlFor="reg-cookies">
            I accept the use of cookies and agree to the privacy policy. CINE BOOK uses cookies to improve your experience and for authentication.
          </label>
        </div>
        {errors.cookies && <p id="reg-cookies-err" style={formStyles.error}>{errors.cookies}</p>}
        <button type="submit" style={{ ...formStyles.btn, ...formStyles.btnPrimary }} disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <div style={formStyles.divider}>— or —</div>
      <button type="button" style={{ ...formStyles.btn, ...formStyles.btnGoogle }} onClick={handleGoogle} disabled={loading || !acceptCookies}>
        Continue with Google
      </button>

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
        Already have an account?{" "}
        <span style={formStyles.link} onClick={onSwitchToLogin} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onSwitchToLogin?.()}>
          Log in
        </span>
      </p>
    </div>
  );
}
