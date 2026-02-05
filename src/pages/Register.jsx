import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Validation patterns for Register / Login forms

const EMAIL_PATTERN = {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
};

// Password: at least one letter, one number, 8+ characters
const PASSWORD_PATTERN = {
    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: "Password must contain at least one letter and one number (min 8 characters)",
};

// Stronger password: lowercase, uppercase, digit, special char (@$!%?&)
const PASSWORD_STRONG_PATTERN = {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    message: "Password must contain at least one lowercase, one uppercase, one number and one special character (@$!%*?&)",
};

function validateEmail(email) {
    if (!email?.trim()) return "Email is required";
    if (!EMAIL_PATTERN.value.test(email.trim())) return EMAIL_PATTERN.message;
    return null;
}

function validatePassword(password, useStrong = false) {
    if (!password) return "Password is required";
    const pattern = useStrong ? PASSWORD_STRONG_PATTERN : PASSWORD_PATTERN;
    if (!pattern.value.test(password)) return pattern.message;
    return null;
}

const COOKIE_CONSENT_NAME = "cinebook_cookie_consent";
const COOKIE_CONSENT_HOURS = 2;

function setCookieConsent() {
    const maxAge = COOKIE_CONSENT_HOURS * 60 * 60;
    document.cookie = `${COOKIE_CONSENT_NAME}=accepted; max-age=${maxAge}; path=/; SameSite=Lax`;
}

const formStyles = {
    wrap: {
        maxWidth: 440,
        margin: "0 auto",
        padding: "60px 24px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    card: {
        background: "rgba(20, 20, 35, 0.8)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "48px 40px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
    logo: {
        textAlign: "center",
        marginBottom: "32px",
    },
    logoText: {
        fontSize: "36px",
        fontWeight: 800,
        background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #ec4899 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    },
    title: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "8px",
        textAlign: "center",
        color: "#ffffff",
    },
    sub: {
        textAlign: "center",
        opacity: 0.7,
        marginBottom: "32px",
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "15px",
    },
    group: { marginBottom: "20px" },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.9)",
    },
    input: {
        width: "100%",
        padding: "14px 18px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.05)",
        color: "#fff",
        fontSize: "15px",
        boxSizing: "border-box",
        transition: "all 0.3s ease",
    },
    inputFocus: {
        outline: "none",
        borderColor: "#8b5cf6",
        background: "rgba(139, 92, 246, 0.1)",
        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
    },
    checkboxRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "20px",
    },
    checkbox: {
        marginTop: "3px",
        width: "18px",
        height: "18px",
        cursor: "pointer",
        accentColor: "#8b5cf6",
    },
    checkboxLabel: {
        fontSize: "13px",
        opacity: 0.9,
        lineHeight: "1.5",
        cursor: "pointer",
        color: "rgba(255, 255, 255, 0.8)",
    },
    error: { fontSize: "13px", color: "#f87171", marginTop: "6px" },
    btn: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "none",
        fontSize: "16px",
        fontWeight: 600,
        cursor: "pointer",
        marginTop: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
    },
    btnPrimary: {
        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
        color: "#fff",
        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
    },
    btnGoogle: {
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.2)",
    },
    divider: {
        textAlign: "center",
        margin: "28px 0",
        opacity: 0.5,
        position: "relative",
    },
    dividerLine: {
        height: "1px",
        background: "rgba(255, 255, 255, 0.1)",
        width: "100%",
    },
    dividerText: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(20, 20, 35, 0.8)",
        padding: "0 16px",
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: "13px",
    },
    link: {
        color: "#a78bfa",
        cursor: "pointer",
        textDecoration: "none",
        fontWeight: 500,
        transition: "all 0.3s ease",
    },
    footer: {
        textAlign: "center",
        marginTop: "28px",
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.6)",
    },
    googleIcon: {
        width: "20px",
        height: "20px",
    },
};

export default function Register({ onSwitchToLogin, onSuccess }) {
    const { signUpWithEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [acceptCookies, setAcceptCookies] = useState(false);
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);

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
            navigate("/");
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
            navigate("/");
        } catch (err) {
            setAuthError(err.message || "Google sign up failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={formStyles.wrap}>
            <div style={formStyles.card}>
                {/* Logo */}
                <div style={formStyles.logo}>
                    <div style={formStyles.logoText}>CINE BOOK</div>
                </div>

                <h1 style={formStyles.title}>Create account</h1>
                <p style={formStyles.sub}>Sign up to book movies and more</p>

                {authError && (
                    <div style={{
                        background: "rgba(248, 113, 113, 0.1)",
                        border: "1px solid rgba(248, 113, 113, 0.3)",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "20px",
                        color: "#f87171",
                        fontSize: "14px",
                    }}>
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={formStyles.group}>
                        <label style={formStyles.label} htmlFor="reg-name">Display name (optional)</label>
                        <input
                            id="reg-name"
                            type="text"
                            style={{
                                ...formStyles.input,
                                ...(focused === 'name' ? formStyles.inputFocus : {}),
                            }}
                            placeholder="Your name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                        />
                    </div>
                    <div style={formStyles.group}>
                        <label style={formStyles.label} htmlFor="reg-email">Email *</label>
                        <input
                            id="reg-email"
                            type="email"
                            style={{
                                ...formStyles.input,
                                ...(focused === 'email' ? formStyles.inputFocus : {}),
                            }}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((p) => ({ ...p, email: null }));
                            }}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused(null)}
                        />
                        {errors.email && <p style={formStyles.error}>{errors.email}</p>}
                    </div>
                    <div style={formStyles.group}>
                        <label style={formStyles.label} htmlFor="reg-password">Password *</label>
                        <input
                            id="reg-password"
                            type="password"
                            style={{
                                ...formStyles.input,
                                ...(focused === 'password' ? formStyles.inputFocus : {}),
                            }}
                            placeholder="Min 8 chars, letter + number"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((p) => ({ ...p, password: null }));
                            }}
                            onFocus={() => setFocused('password')}
                            onBlur={() => setFocused(null)}
                        />
                        {errors.password && <p style={formStyles.error}>{errors.password}</p>}
                    </div>
                    <div style={formStyles.checkboxRow}>
                        <input
                            id="reg-cookies"
                            type="checkbox"
                            style={formStyles.checkbox}
                            checked={acceptCookies}
                            onChange={(e) => {
                                setAcceptCookies(e.target.checked);
                                setErrors((p) => ({ ...p, cookies: null }));
                            }}
                        />
                        <label style={formStyles.checkboxLabel} htmlFor="reg-cookies">
                            I accept the use of cookies and agree. CINE BOOK to the privacy policy uses cookies to improve your experience.
                        </label>
                    </div>
                    {errors.cookies && <p style={formStyles.error}>{errors.cookies}</p>}
                    <button
                        type="submit"
                        style={{
                            ...formStyles.btn,
                            ...formStyles.btnPrimary,
                            opacity: loading ? 0.7 : 1,
                        }}
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <div style={formStyles.divider}>
                    <div style={formStyles.dividerLine}></div>
                    <span style={formStyles.dividerText}>or continue with</span>
                </div>

                <button
                    type="button"
                    style={{
                        ...formStyles.btn,
                        ...formStyles.btnGoogle,
                        opacity: loading || !acceptCookies ? 0.7 : 1,
                    }}
                    onClick={handleGoogle}
                    disabled={loading || !acceptCookies}
                >
                    <svg viewBox="0 0 24 24" style={formStyles.googleIcon}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p style={formStyles.footer}>
                    Already have an account?{" "}
                    <span
                        style={formStyles.link}
                        onClick={onSwitchToLogin}
                        onMouseOver={(e) => e.target.style.color = "#8b5cf6"}
                        onMouseOut={(e) => e.target.style.color = "#a78bfa"}
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}
