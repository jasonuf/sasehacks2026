import { useState, useEffect } from "react";
import styles from "../styles/styles";
import { apiGetTasks, apiCheckinTask, apiUncheckinTask, FREQ_LABEL } from "../utils/api";

export default function CheckTasks({ token }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    apiGetTasks(token).then(setTasks).catch(() => {});
  }, [token]);

  const toggle = async (taskId, done) => {
    try {
      const updated = done
        ? await apiUncheckinTask(token, taskId)
        : await apiCheckinTask(token, taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch {}
  };

  const pct = tasks.length
    ? Math.round(
        (tasks.filter((t) => !t.is_overdue).length / tasks.length) * 100
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
        <span style={styles.progressLabel}>{pct}% complete</span>
      </div>

      {tasks.length === 0 && (
        <div style={styles.empty}>No tasks yet — add some!</div>
      )}

      <div style={styles.taskList}>
        {tasks.map((task) => {
          const done = !task.is_overdue;

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
                  onChange={() => toggle(task.id, done)}
                  style={styles.checkbox}
                />

                <div>
                  <span
                    style={{
                      ...styles.taskName,
                      ...(done ? styles.taskNameDone : {}),
                    }}
                  >
                    {task.title}
                  </span>

                  <span style={styles.taskFreq}>
                    {FREQ_LABEL[task.frequency] ?? task.frequency}
                    {task.start_time ? ` · ${task.start_time}` : ""}
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
