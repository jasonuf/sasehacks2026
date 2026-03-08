
import {useMemo} from "react";
import styles from "../styles/styles";

export default function FailureBanner({ failures }) {
  const messages = ["forgot", "abandoned", "missed", "skipped", "stopped", "neglected", "ignored", "overlooked", "disregarded", "omitted"];
  const emojis = ["🚨", "😱", "💀", "⚠", "🔥", "😂", ];
  const success = ["on track", "crushing it", "killing it", "rocking it", "nailing it", "slaying it", "dominating it", "winning it", "crushing goals", "smashing targets"];
  const successEmojis = ["🎉", "🏆", "🥳", "👏", "🙌", "💪", "🚀", "🌟", "✨"];

  const randomMessage = useMemo(() => {
    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
  }, [failures]);

  const randomSuccess = useMemo(() => {
    return {
      message: success[Math.floor(Math.random() * success.length)],
      emoji: successEmojis[Math.floor(Math.random() * successEmojis.length)],
    };
  }, [failures]);

  if (!failures.length) {
    return (
      <div style={{ ...styles.banner, background: "#14532d", color: "#a7e4bd" }}>
        {randomSuccess.emoji} All friends are {randomSuccess.message} today!
      </div>
    );
  }

  return (
    <div style={styles.banner}>
      {failures.map((f, i) => (
        <span key={i} style={styles.bannerItem}>
          {randomMessage.emoji} {f.friend} {randomMessage.message} {f.task}
          {i < failures.length - 1 ? " · " : ""}
        </span>
      ))}
    </div>
  );
}
