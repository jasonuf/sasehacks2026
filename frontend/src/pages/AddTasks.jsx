import { useState } from "react";
import styles from "../styles/styles";

export default function AddTasks({ user, updateUser }) {
  const [taskType, setTaskType] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [submitted, setSubmitted] = useState(false);

  const freqOptions = ["Daily", "Weekly", "3x/week", "Weekdays", "Custom"];

  const handleSubmit = () => {
    if (!taskType.trim()) return;

    updateUser((u) => ({
      ...u,
      tasks: [
        ...u.tasks,
        {
          id: Date.now(),
          type: taskType.trim(),
          frequency,
          completedDates: [],
        },
      ],
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
            onChange={(e) => setTaskType(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Frequency</label>

          <div style={styles.freqGrid}>
            {freqOptions.map((f) => (
              <button
                key={f}
                style={{
                  ...styles.freqBtn,
                  ...(frequency === f ? styles.freqBtnActive : {}),
                }}
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