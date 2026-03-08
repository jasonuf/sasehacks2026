
import styles from "../styles/styles";

export default function FailureBanner({ failures }) {
  const messages = ["forgot", "abandoned", "missed", "skipped", "stopped", "neglected", "ignored", "overlooked", "disregarded", "omitted"];
  const emojis = ["🚨", "😱", "💀", "⚠", "🔥", "😂", ];
  const success = ["on track", "crushing it", "killing it", "rocking it", "nailing it", "slaying it", "dominating it", "winning it", "crushing goals", "smashing targets"];
  const sucessEmojis = ["🎉", "🏆", "🥳", "👏", "🙌", "💪", "🚀", "🌟", "✨"];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (!failures.length) {
    const message = randomItem(success);
    const emoji = randomItem(sucessEmojis);
    return (
      <div style={{ ...styles.banner, background: "#14532d", color: "#a7e4bd" }}>
        {emoji} All friends are {message} today!
      </div>
    );
  }

  return (
    <div style={styles.banner}>
      {failures.map((f, i) => {
        const successMessage = randomItem(messages);
        const successEmoji = randomItem(emojis);
        return (
          <span key={i} style={styles.bannerItem}>
            {successEmoji} {f.friend} {successMessage} {f.task}
            {i < failures.length - 1 ? "  ·  " : ""}
          </span>
        );
      })}
    </div>
  );
}
