import { useState } from "react";
import styles from "../styles/styles";

export default function RegisterScreen({ onRegister, onSwitchToLogin, error }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    onRegister(email, username, password);
  };

  return (
    <div style={styles.loginBg}>
      <style>
        {`
          @keyframes rise {
            0% { transform: translateY(0); opacity: 0.6; }
            100% { transform: translateY(-1000px); opacity: 0; }
          }
        `}
      </style>

      <div style={styles.bubbleContainer}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: "-120px",
              left: `${Math.random() * 100}%`,
              width: `${25 + Math.random() * 40}px`,
              height: `${25 + Math.random() * 40}px`,
              background: "rgba(206, 228, 239, 0.9)",
              borderRadius: "50%",
              animationName: "rise",
              animationDuration: `${5 + Math.random() * 6}s`,
              animationTimingFunction: "ease-in",
              animationIterationCount: "infinite",
              pointerEvents: "none",
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "350px",
        width: "100%",
        pointerEvents: "none",
        zIndex: 3,
      }}>
        <img
          src="seaweed.webp.webp"
          alt="seaweed left"
          style={{
            ...styles.seaweed,
            position: "absolute",
            left: "0",
            bottom: "0",
            width: "350px",
            height: "auto",
          }}
        />
        <img
          src="seaweed.webp.webp"
          alt="seaweed right"
          style={{
            ...styles.seaweed,
            position: "absolute",
            right: "0",
            bottom: "0",
            width: "350px",
            height: "auto",
            transform: "scaleX(-1)",
          }}
        />
      </div>

      <div style={styles.loginCard}>
        <div style={styles.logoContainer}>
          <img src="/appLogo.png" alt="Logo" style={styles.loginLogo} />
        </div>

        <p style={styles.loginSub}>Create your account.</p>

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        {error && (
          <p style={styles.errorMsg}>{error}</p>
        )}

        <button style={styles.loginBtn} onClick={handleRegister}>
          Create Account
        </button>

        <p style={{ ...styles.hint, cursor: "pointer" }} onClick={onSwitchToLogin}>
          Already have an account? <span style={{ textDecoration: "underline" }}>Sign in</span>
        </p>
      </div>

      <div style={styles.waveContainer}>
        <svg
          style={styles.waveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
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
