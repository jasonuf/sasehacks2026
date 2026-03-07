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
       {/* WAVE GOES HERE */}
      <div style={styles.waveContainer}>
        <svg 
          style={styles.waveSvg} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320"
        >
          <path
            fill="#94B4C1"
            fillOpacity="1"
            d="M0,224L60,224C120,224,240,224,360,192C480,160,600,96,720,90.7C840,85,960,139,1080,154.7C1200,171,1320,149,1380,138.7L1440,128L1440,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
}