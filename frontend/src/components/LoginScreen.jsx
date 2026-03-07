import { useState } from "react";
import styles from "../styles/styles";

export default function LoginScreen({ onLogin, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    onLogin(username, password);
  };

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
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <p style={styles.errorMsg}>
            {error}
          </p>
        )}

        <button style={styles.loginBtn} onClick={handleLogin}>
          Sign In
        </button>

        <p style={styles.hint}>
          Try: alice / pass · bob / pass
        </p>
      </div>
    </div>
  );
}