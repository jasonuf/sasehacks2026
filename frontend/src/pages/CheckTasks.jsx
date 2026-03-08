import styles from "../styles/styles";
import { today } from "../utils/date";

export default function CheckTasks({ user, updateUser }) {
const toggleTask = (taskId) => {
  updateUser((u) => {
    const newTasks = u.tasks.map((t) => {
      if (t.id !== taskId) return t;

      const done = t.completedDates.includes(today());

      return {
        ...t,
        completedDates: done
          ? t.completedDates.filter((d) => d !== today())
          : [...t.completedDates, today()],
      };
    });

    // 🔥 Check if ALL tasks are complete today
    const allCompleted =
      newTasks.length > 0 &&
      newTasks.every((t) => t.completedDates.includes(today()));

    let streak = u.streak || 0;
    let last = u.lastStreakDate;

    // Only increase streak if all tasks are done AND not counted today yet
    if (allCompleted && last !== today()) {
      streak += 1;
      last = today();
    }

    // If tasks are NOT all complete today, do NOT increase streak
    return {
      ...u,
      tasks: newTasks,
      streak,
      lastStreakDate: last,
    };
  });
}

  const pct = user.tasks.length
    ? Math.round(
        (user.tasks.filter((t) =>
          t.completedDates.includes(today())
        ).length /
          user.tasks.length) *
          100
      )
    : 0;

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Today's Tasks</h2>

      {/* 🔥 Streak Box */}
      <div style={styles.streakBox}>
        🔥 Streak: {user.streak || 0} days
      </div>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${pct}%`,
          }}
        />
        <span style={styles.progressLabel}>
          {pct}% complete
        </span>
      </div>

      {user.tasks.length === 0 && (
        <div style={styles.empty}>
          No tasks yet — add some!
        </div>
      )}

      <div style={styles.taskList}>
        {user.tasks.map((task) => {
          const done = task.completedDates.includes(today());

          return (
            <div
              key={task.id}
              style={{
                ...styles.taskRow,
                ...(done ? styles.taskRowDone : {}),
              }}
            >
              <label style={styles.taskLabel}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTask(task.id)}
                  style={styles.checkbox}
                />

                <div>
                  <span
                    style={{
                      ...styles.taskName,
                      ...(done ? styles.taskNameDone : {}),
                    }}
                  >
                    {task.type}
                  </span>

                  <span style={styles.taskFreq}>
                    {task.frequency}
                  </span>
                </div>
              </label>

              <span
                style={{
                  ...styles.taskStatus,
                  color: done ? "#4ade80" : "#f87171",
                }}
              >
                {done ? "✓ Done" : "Pending"}
              </span>
              <button
                style={styles.deleteBtn}
                onClick={() =>
                  updateUser((u) => ({
                    ...u,
                    tasks: u.tasks.filter((t) => t.id !== task.id),
                  }))
                }
              >
                ✖ Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}