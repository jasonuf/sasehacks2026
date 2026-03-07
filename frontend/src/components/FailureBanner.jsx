import styles from "../styles/styles";

export default function FailureBanner({ failures }) {
  if (!failures.length) {
    return (
      <div style={{ ...styles.banner, background: "#14532d", color: "#4ade80" }}>
        🎉 All friends are on track today!
      </div>
    );
  }

  return (
    <div style={styles.banner}>
      {failures.map((f, i) => (
        <span key={i} style={styles.bannerItem}>
          ⚠ {f.friend} missed {f.task}
          {i < failures.length - 1 ? "  ·  " : ""}
        </span>
      ))}
    </div>
  );
}
