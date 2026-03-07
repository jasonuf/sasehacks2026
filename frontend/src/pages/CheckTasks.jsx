import styles from "../styles/styles";
import { today } from "../utils/date";

export default function CheckTasks({ user, updateUser }) {
  const toggleTask = (taskId) => {
    updateUser((u) => ({
      ...u,
      tasks: u.tasks.map((t) => {
        if (t.id !== taskId) return t;

        const done = t.completedDates.includes(today());

        return {
          ...t,
          completedDates: done
            ? t.completedDates.filter((d) => d !== today())
            : [...t.completedDates, today()],
        };
      }),
    }));
  };

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
            </div>
          );
        })}
      </div>
    </div>
  );
}