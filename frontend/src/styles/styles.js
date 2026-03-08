const styles = {
  app: {
    minHeight: "100vh",
    background: "#EFECE3",
    color: "#0f0e0d",
    fontFamily: "'Times New Roman', Times, serif",
    display: "flex",
    flexDirection: "column",
  },

  // Login
  loginBg: {
    minHeight: "100vh",
    background: "#EFECE3", //background color
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

    bubbleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 2,
    pointerEvents: "none",
  },

  seaweedContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "50%",
    pointerEvents: "none",
    zIndex: 2,
},
  loginCard: {
  background: "#547792", //login background
  border: "1px solid #547792",
  borderRadius: 16,
  padding: "48px 40px",
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 0 60px #56707b",
  position: "relative",
  zIndex: 2

},
    logoContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px"
  },

  loginLogo: {
    width: "200px",
    height: "auto"
  },

  loginTitle: {
    margin: "0 0 4px",
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
    color: "#EFECE3",
    letterSpacing: "0.05em",
  },

  loginSub: {
    textAlign: "center",
    color: "#EFECE3",
    fontSize: 13,
    marginBottom: 32,
    marginTop: 0,
  },

  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #EFECE3, #EFECE3)",
    color: "#000000",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
    marginTop: 8,
  },

  hint: {
    textAlign: "center",
    fontSize: 11,
    color: "#EFECE3",
    marginTop: 16,
  },

  errorMsg: {
    color: "#f87171",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },

  waveContainer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  lineHeight: 0,
  zIndex: 1
  
},

waveSvg: {
  width: "110%",
  animation: "waveMove 4s linear infinite"
},

loginBg: {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative", // important
},

  // Banner
  banner: {
    background: "#450a0a",
    color: "#f87171",
    padding: "10px 20px",
    textAlign: "center",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.02em",
    minHeight: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  bannerItem: {
    display: "inline",
  },

  // Navbar
  nav: {
    background: "#547792",
    borderBottom: "1px solid #1e1e2e",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    height: 56,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  navBrand: {
    fontWeight: 800,
    fontSize: 16,
    color: "#82b8f5",
    letterSpacing: "0.08em",
    marginRight: 16,
  },

  navTabs: {
    display: "flex",
    gap: 4,
    flex: 1,
  },

  navTab: {
    background: "transparent",
    border: "none",
    color: "#6b7280",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },

  navTabActive: {
    background: "#1e1e2e",
    color: "#a78bfa",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  navUser: {
    fontSize: 12,
    color: "#4b5563",
  },

  logoutBtn: {
    background: "transparent",
    border: "1px solid #2a2a3e",
    color: "#6b7280",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
  },

  // Main
  main: {
    flex: 1,
    padding: "32px 24px",
    maxWidth: 720,
    margin: "0 auto",
    width: "100%",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: 4,
    letterSpacing: "0.03em",
  },

  sectionDesc: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 24,
  },

  card: {
    background: "#2c2131",
    border: "1px solid #1e1e2e",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#94a3b8",
    marginBottom: 16,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    display: "block",
    fontSize: 12,
    color: "#EFECE3",
    marginBottom: 8,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    background: "#EFECE3",
    border: "1px solid #EFECE3",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#000000",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
  },

  primaryBtn: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },

  // Tasks
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  taskRow: {
    background: "#11111b",
    border: "1px solid #1e1e2e",
    borderRadius: 10,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  taskRowDone: {
    borderColor: "#14532d",
  },

  taskLabel: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
    flex: 1,
  },

  checkbox: {
    width: 18,
    height: 18,
    accentColor: "#a78bfa",
  },

  taskName: {
    display: "block",
    fontSize: 15,
    fontWeight: 600,
  },

  taskNameDone: {
    textDecoration: "line-through",
    color: "#4b5563",
  },

  taskFreq: {
    fontSize: 11,
    color: "#4b5563",
    marginTop: 2,
    display: "block",
  },

  taskStatus: {
    fontSize: 12,
    fontWeight: 700,
  },

  empty: {
    color: "#4b5563",
    fontSize: 14,
    textAlign: "center",
    padding: "24px 0",
  },

  // Friends
  inlineRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },

  reqRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  reqName: {
    flex: 1,
    fontSize: 14,
    color: "#94a3b8",
  },

  acceptBtn: {
    background: "#14532d",
    color: "#4ade80",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },

  declineBtn: {
    background: "#450a0a",
    color: "#f87171",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },

  friendBlock: {
    background: "#0d0d17",
    border: "1px solid #1e1e2e",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },

  friendHeader: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#e2e8f0",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },

  friendMeta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  friendAvatar: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
  },

  friendName: {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
  },

  friendStat: {
    fontSize: 11,
    display: "block",
    marginTop: 2,
  },

  chevron: {
    color: "#4b5563",
    fontSize: 12,
  },

  friendTasks: {
    borderTop: "1px solid #1e1e2e",
    padding: "14px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  friendTask: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  taskDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
};

export default styles;