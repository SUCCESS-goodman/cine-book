import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            textAlign: "center",
            padding: "0 20px"
        }}>
            <h1 style={{ fontSize: 72, fontWeight: 700, marginBottom: 16, color: "#fff" }}>
                404
            </h1>
            <p style={{ fontSize: 24, fontWeight: 500, marginBottom: 8, color: "#fff" }}>
                Page Not Found
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 32 }}>
                Sorry, the page you're looking for doesn't exist.
            </p>
            <Link to="/">
                <button style={{
                    padding: "14px 28px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer"
                }}>
                    Go Home
                </button>
            </Link>
        </div>
    );
};

export default NotFound;
