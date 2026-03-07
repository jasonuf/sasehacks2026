import { useState, useEffect } from "react";

// ── Cookie helpers ──────────────────────────────────────────────────────────
const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
};
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); } catch { return null; }
};
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// ── Seed data ───────────────────────────────────────────────────────────────
const USERS_KEY = "acct_users";
const SESSION_KEY = "acct_session";

const seedUsers = () => {
  const existing = getCookie(USERS_KEY);
  if (existing) return existing;
  const users = {
    alice: {
      username: "alice", password: "pass",
      email: "alice@example.com",
      tasks: [
        { id: 1, type: "Exercise", frequency: "Daily", completedDates: [today(), yesterday()] },
        { id: 2, type: "Read", frequency: "Weekly", completedDates: [] },
      ],
      friends: ["bob"],
      friendRequests: [],
    },
    bob: {
      username: "bob", password: "pass",
      email: "bob@example.com",
      tasks: [
        { id: 1, type: "Meditate", frequency: "Daily", completedDates: [] },
        { id: 2, type: "Gym", frequency: "3x/week", completedDates: [yesterday()] },
      ],
      friends: ["alice"],
      friendRequests: [],
    },
  };
  setCookie(USERS_KEY, users, 30);
  return users;
};

function today() { return new Date().toISOString().slice(0, 10); }
function yesterday() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function isFailedToday(task) {
  if (task.frequency === "Daily") return !task.completedDates.includes(today());
  return false;
}

// ── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState(() => seedUsers());
  const [session, setSession] = useState(() => getCookie(SESSION_KEY));
  const [page, setPage] = useState("check");
  const [loginError, setLoginError] = useState("");

  const currentUser = session ? users[session.username] : null;

  // Persist users on change
  useEffect(() => { setCookie(USERS_KEY, users, 30); }, [users]);

  const login = (username, password) => {
    const user = users[username.toLowerCase()];
    if (!user || user.password !== password) {
      setLoginError("Invalid username or password.");
      return;
    }
    const sess = { username: user.username };
    setCookie(SESSION_KEY, sess);
    setSession(sess);
    setLoginError("");
  };

  const logout = () => {
    deleteCookie(SESSION_KEY);
    setSession(null);
  };

  const updateCurrentUser = (updater) => {
    setUsers(prev => {
      const updated = { ...prev };
      updated[session.username] = updater(updated[session.username]);
      return updated;
    });
  };

  // Friend failures
  const friendFailures = currentUser
    ? currentUser.friends.flatMap(fname => {
        const friend = users[fname];
        if (!friend) return [];
        return friend.tasks
          .filter(isFailedToday)
          .map(t => ({ friend: fname, task: t.type }));
      })
    : [];

  if (!currentUser) {
    return <LoginScreen onLogin={login} error={loginError} />;
  }

  return (
    <div style={styles.app}>
      <FailureBanner failures={friendFailures} />
      <Navbar page={page} setPage={setPage} onLogout={logout} username={currentUser.username} />
      <main style={styles.main}>
        {page === "add"    && <AddTasks user={currentUser} updateUser={updateCurrentUser} />}
        {page === "check"  && <CheckTasks user={currentUser} updateUser={updateCurrentUser} />}
        {page === "friends"&& <Friends user={currentUser} users={users} updateUser={updateCurrentUser} setUsers={setUsers} session={session} />}
      </main>
    </div>
  );
}

// ── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={styles.loginBg}>
      <div style={styles.loginCard}>
        <div style={styles.loginLogo}>✓</div>
        <h1 style={styles.loginTitle}>Accountable</h1>
        <p style={styles.loginSub}>Hold each other to it.</p>
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onLogin(username, password)}
            autoFocus
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onLogin(username, password)}
          />
        </div>
        {error && <p style={styles.errorMsg}>{error}</p>}
        <button style={styles.loginBtn} onClick={() => onLogin(username, password)}>
          Sign In
        </button>
        <p style={styles.hint}>Try: alice / pass · bob / pass</p>
      </div>
    </div>
  );
}

// ── Failure Banner ────────────────────────────────────────────────────────────
function FailureBanner({ failures }) {
  if (!failures.length) return (
    <div style={{ ...styles.banner, background: "#14532d", color: "#4ade80" }}>
      🎉 All friends are on track today!
    </div>
  );
  return (
    <div style={styles.banner}>
      {failures.map((f, i) => (
        <span key={i} style={styles.bannerItem}>
          ⚠ {f.friend} missed {f.task}{i < failures.length - 1 ? "  ·  " : ""}
        </span>
      ))}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, onLogout, username }) {
  const tabs = [
    { id: "add",     label: "+ Add Tasks" },
    { id: "check",   label: "✓ My Tasks" },
    { id: "friends", label: "◎ Friends" },
  ];
  return (
    <nav style={styles.nav}>
      <span style={styles.navBrand}>Accountable</span>
      <div style={styles.navTabs}>
        {tabs.map(t => (
          <button
            key={t.id}
            style={{ ...styles.navTab, ...(page === t.id ? styles.navTabActive : {}) }}
            onClick={() => setPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={styles.navRight}>
        <span style={styles.navUser}>@{username}</span>
        <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

// ── Add Tasks ─────────────────────────────────────────────────────────────────
function AddTasks({ user, updateUser }) {
  const [taskType, setTaskType] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [submitted, setSubmitted] = useState(false);

  const freqOptions = ["Daily", "Weekly", "3x/week", "Weekdays", "Custom"];

  const handleSubmit = () => {
    if (!taskType.trim()) return;
    updateUser(u => ({
      ...u,
      tasks: [...u.tasks, {
        id: Date.now(),
        type: taskType.trim(),
        frequency,
        completedDates: [],
      }]
    }));
    setTaskType("");
    setFrequency("Daily");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Add a Task</h2>
      <p style={styles.sectionDesc}>Create a recurring habit to track.</p>
      <div style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Task Type</label>
          <input
            style={styles.input}
            placeholder="e.g. Exercise, Read, Meditate…"
            value={taskType}
            onChange={e => setTaskType(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Frequency</label>
          <div style={styles.freqGrid}>
            {freqOptions.map(f => (
              <button
                key={f}
                style={{ ...styles.freqBtn, ...(frequency === f ? styles.freqBtnActive : {}) }}
                onClick={() => setFrequency(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button style={styles.primaryBtn} onClick={handleSubmit}>
          {submitted ? "✓ Task Added!" : "Add Task"}
        </button>
      </div>
    </div>
  );
}

// ── Check Tasks ───────────────────────────────────────────────────────────────
function CheckTasks({ user, updateUser }) {
  const toggleTask = (taskId) => {
    updateUser(u => ({
      ...u,
      tasks: u.tasks.map(t => {
        if (t.id !== taskId) return t;
        const done = t.completedDates.includes(today());
        return {
          ...t,
          completedDates: done
            ? t.completedDates.filter(d => d !== today())
            : [...t.completedDates, today()],
        };
      })
    }));
  };

  const pct = user.tasks.length
    ? Math.round(user.tasks.filter(t => t.completedDates.includes(today())).length / user.tasks.length * 100)
    : 0;

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Today's Tasks</h2>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${pct}%` }} />
        <span style={styles.progressLabel}>{pct}% complete</span>
      </div>
      {user.tasks.length === 0 && (
        <div style={styles.empty}>No tasks yet — add some!</div>
      )}
      <div style={styles.taskList}>
        {user.tasks.map(task => {
          const done = task.completedDates.includes(today());
          return (
            <div key={task.id} style={{ ...styles.taskRow, ...(done ? styles.taskRowDone : {}) }}>
              <label style={styles.taskLabel}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTask(task.id)}
                  style={styles.checkbox}
                />
                <div>
                  <span style={{ ...styles.taskName, ...(done ? styles.taskNameDone : {}) }}>
                    {task.type}
                  </span>
                  <span style={styles.taskFreq}>{task.frequency}</span>
                </div>
              </label>
              <span style={{ ...styles.taskStatus, color: done ? "#4ade80" : "#f87171" }}>
                {done ? "✓ Done" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Friends ───────────────────────────────────────────────────────────────────
function Friends({ user, users, updateUser, setUsers, session }) {
  const [emailInput, setEmailInput] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [expanded, setExpanded] = useState(null);

  const sendRequest = () => {
    const target = Object.values(users).find(u => u.email === emailInput.trim());
    if (!target) { setReqMsg("No user found with that email."); return; }
    if (target.username === session.username) { setReqMsg("That's you!"); return; }
    if (user.friends.includes(target.username)) { setReqMsg("Already friends."); return; }
    if (target.friendRequests.includes(session.username)) { setReqMsg("Request already sent."); return; }

    setUsers(prev => ({
      ...prev,
      [target.username]: {
        ...prev[target.username],
        friendRequests: [...prev[target.username].friendRequests, session.username],
      }
    }));
    setReqMsg(`Friend request sent to ${target.username}!`);
    setEmailInput("");
  };

  const acceptRequest = (fromUsername) => {
    setUsers(prev => ({
      ...prev,
      [session.username]: {
        ...prev[session.username],
        friends: [...prev[session.username].friends, fromUsername],
        friendRequests: prev[session.username].friendRequests.filter(r => r !== fromUsername),
      },
      [fromUsername]: {
        ...prev[fromUsername],
        friends: [...prev[fromUsername].friends, session.username],
      }
    }));
  };

  const declineRequest = (fromUsername) => {
    setUsers(prev => ({
      ...prev,
      [session.username]: {
        ...prev[session.username],
        friendRequests: prev[session.username].friendRequests.filter(r => r !== fromUsername),
      }
    }));
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Friends</h2>

      {/* Add Friend */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add a Friend</h3>
        <div style={styles.inlineRow}>
          <input
            style={{ ...styles.input, flex: 1 }}
            placeholder="friend@email.com"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendRequest()}
          />
          <button style={styles.primaryBtn} onClick={sendRequest}>Request</button>
        </div>
        {reqMsg && <p style={{ marginTop: 8, color: reqMsg.includes("sent") ? "#4ade80" : "#f87171", fontSize: 13 }}>{reqMsg}</p>}
      </div>

      {/* Incoming Requests */}
      {user.friendRequests.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Incoming Requests</h3>
          {user.friendRequests.map(req => (
            <div key={req} style={styles.reqRow}>
              <span style={styles.reqName}>@{req}</span>
              <button style={styles.acceptBtn} onClick={() => acceptRequest(req)}>Accept</button>
              <button style={styles.declineBtn} onClick={() => declineRequest(req)}>Decline</button>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>My Friends ({user.friends.length})</h3>
        {user.friends.length === 0 && <p style={styles.empty}>No friends yet — send a request!</p>}
        {user.friends.map(fname => {
          const friend = users[fname];
          if (!friend) return null;
          const failures = friend.tasks.filter(isFailedToday);
          const done = friend.tasks.filter(t => t.completedDates.includes(today()));
          const isOpen = expanded === fname;
          return (
            <div key={fname} style={styles.friendBlock}>
              <button style={styles.friendHeader} onClick={() => setExpanded(isOpen ? null : fname)}>
                <div style={styles.friendMeta}>
                  <span style={styles.friendAvatar}>{fname[0].toUpperCase()}</span>
                  <div>
                    <span style={styles.friendName}>@{fname}</span>
                    <span style={{ ...styles.friendStat, color: failures.length ? "#f87171" : "#4ade80" }}>
                      {done.length}/{friend.tasks.length} done today
                      {failures.length > 0 ? ` · ${failures.length} missed` : ""}
                    </span>
                  </div>
                </div>
                <span style={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div style={styles.friendTasks}>
                  {friend.tasks.map(t => {
                    const completed = t.completedDates.includes(today());
                    return (
                      <div key={t.id} style={styles.friendTask}>
                        <span style={{ ...styles.taskDot, background: completed ? "#4ade80" : "#f87171" }} />
                        <span style={styles.taskName}>{t.type}</span>
                        <span style={styles.taskFreq}>{t.frequency}</span>
                        <span style={{ marginLeft: "auto", fontSize: 12, color: completed ? "#4ade80" : "#f87171" }}>
                          {completed ? "Done" : "Not done"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e2e8f0",
    fontFamily: "'Courier New', Courier, monospace",
    display: "flex",
    flexDirection: "column",
  },
  // Login
  loginBg: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0a0f 70%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loginCard: {
    background: "#11111b",
    border: "1px solid #2a2a3e",
    borderRadius: 16,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 0 60px rgba(139,92,246,0.15)",
  },
  loginLogo: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 12,
    color: "#a78bfa",
  },
  loginTitle: {
    margin: "0 0 4px",
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
    color: "#f1f5f9",
    letterSpacing: "0.05em",
    fontFamily: "'Courier New', monospace",
  },
  loginSub: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 32,
    marginTop: 0,
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
    marginTop: 8,
    fontFamily: "'Courier New', monospace",
  },
  hint: { textAlign: "center", fontSize: 11, color: "#4b5563", marginTop: 16 },
  errorMsg: { color: "#f87171", fontSize: 13, marginTop: 4, marginBottom: 8 },
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
  bannerItem: { display: "inline" },
  // Nav
  nav: {
    background: "#11111b",
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
    color: "#a78bfa",
    letterSpacing: "0.08em",
    marginRight: 16,
    fontFamily: "'Courier New', monospace",
  },
  navTabs: { display: "flex", gap: 4, flex: 1 },
  navTab: {
    background: "transparent",
    border: "none",
    color: "#6b7280",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'Courier New', monospace",
    fontWeight: 600,
    letterSpacing: "0.03em",
    transition: "all 0.15s",
  },
  navTabActive: { background: "#1e1e2e", color: "#a78bfa" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  navUser: { fontSize: 12, color: "#4b5563" },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #2a2a3e",
    color: "#6b7280",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Courier New', monospace",
  },
  // Main
  main: { flex: 1, padding: "32px 24px", maxWidth: 720, margin: "0 auto", width: "100%" },
  section: {},
  sectionTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: 4,
    letterSpacing: "0.03em",
  },
  sectionDesc: { color: "#6b7280", fontSize: 13, marginBottom: 24, marginTop: 0 },
  card: {
    background: "#11111b",
    border: "1px solid #1e1e2e",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16, marginTop: 0, letterSpacing: "0.06em" },
  field: { marginBottom: 20 },
  label: { display: "block", fontSize: 12, color: "#6b7280", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" },
  input: {
    width: "100%",
    background: "#0d0d17",
    border: "1px solid #2a2a3e",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e2e8f0",
    fontSize: 14,
    fontFamily: "'Courier New', monospace",
    boxSizing: "border-box",
    outline: "none",
  },
  freqGrid: { display: "flex", gap: 8, flexWrap: "wrap" },
  freqBtn: {
    background: "#0d0d17",
    border: "1px solid #2a2a3e",
    color: "#6b7280",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Courier New', monospace",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  freqBtnActive: { background: "#1e1e2e", border: "1px solid #7c3aed", color: "#a78bfa" },
  primaryBtn: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  },
  // Progress
  progressBar: {
    background: "#1e1e2e",
    borderRadius: 8,
    height: 28,
    position: "relative",
    overflow: "hidden",
    marginBottom: 24,
  },
  progressFill: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
    transition: "width 0.4s ease",
    borderRadius: 8,
  },
  progressLabel: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: 12,
    fontWeight: 700,
    color: "#e2e8f0",
    letterSpacing: "0.06em",
  },
  // Task list
  taskList: { display: "flex", flexDirection: "column", gap: 10 },
  taskRow: {
    background: "#11111b",
    border: "1px solid #1e1e2e",
    borderRadius: 10,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "border-color 0.2s",
  },
  taskRowDone: { borderColor: "#14532d" },
  taskLabel: { display: "flex", alignItems: "center", gap: 14, cursor: "pointer", flex: 1 },
  checkbox: { width: 18, height: 18, accentColor: "#a78bfa", cursor: "pointer" },
  taskName: { display: "block", fontSize: 15, fontWeight: 600, color: "#e2e8f0" },
  taskNameDone: { textDecoration: "line-through", color: "#4b5563" },
  taskFreq: { fontSize: 11, color: "#4b5563", marginTop: 2, display: "block", letterSpacing: "0.05em" },
  taskStatus: { fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" },
  empty: { color: "#4b5563", fontSize: 14, textAlign: "center", padding: "24px 0" },
  // Friends
  inlineRow: { display: "flex", gap: 10, alignItems: "center" },
  reqRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  reqName: { flex: 1, fontSize: 14, color: "#94a3b8" },
  acceptBtn: {
    background: "#14532d",
    color: "#4ade80",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "'Courier New', monospace",
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
    fontFamily: "'Courier New', monospace",
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
    fontFamily: "'Courier New', monospace",
  },
  friendMeta: { display: "flex", alignItems: "center", gap: 12 },
  friendAvatar: {
    width: 36, height: 36,
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
  },
  friendName: { display: "block", fontSize: 14, fontWeight: 700, color: "#f1f5f9", textAlign: "left" },
  friendStat: { fontSize: 11, display: "block", textAlign: "left", marginTop: 2 },
  chevron: { color: "#4b5563", fontSize: 12 },
  friendTasks: { borderTop: "1px solid #1e1e2e", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 },
  friendTask: { display: "flex", alignItems: "center", gap: 10 },
  taskDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
};