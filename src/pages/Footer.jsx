const currentYear = new Date().getFullYear();

const footerStyles = {
    footer: {
        marginTop: "auto",
        padding: "24px 20px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.2)",
        textAlign: "center",
    },
    brand: {
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 8,
        opacity: 0.95,
    },
    copyright: {
        fontSize: 13,
        opacity: 0.75,
    },
    links: {
        marginTop: 12,
        display: "flex",
        justifyContent: "center",
        gap: 20,
        flexWrap: "wrap",
    },
    link: {
        fontSize: 13,
        color: "rgba(255,255,255,0.8)",
        textDecoration: "none",
    },
};

export default function Footer() {
    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.brand}>CINE BOOK</div>
            <p style={footerStyles.copyright}>
                © {currentYear} CINE BOOK. All rights reserved.
            </p>
            <div style={footerStyles.links}>
                <span style={footerStyles.link}>Movies</span>
                <span style={footerStyles.link}>My Bookings</span>
                <span style={footerStyles.link}>Contact</span>
            </div>
        </footer>
    );
}
