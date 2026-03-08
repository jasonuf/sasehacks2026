import { useState } from "react";
import styles from "../styles/styles";
import { apiCreateTask, FREQ_OPTIONS } from "../utils/api";

  const today = () => new Date().toISOString().slice(0, 10);

  const commonTasks = [
    { name: "Exercise", icon: "🏋️" },
    { name: "Read", icon: "📚" },
    { name: "Meditate", icon: "🧘" },
    { name: "Cook", icon: "🍳" },
    { name: "Sleep", icon: "😴" },
    { name: "Shower", icon: "🚿" },
    { name: "Drink Water", icon: "🚰" },
    { name: "Write", icon: "✍️" },
    { name: "Cleaning", icon: "🧹" },
    { name: "Study", icon: "📖" },
    { name: "Brush Teeth", icon: "🦷" },
    { name: "Take out Trash", icon: "🗑️" },
    { name: "Grocery Shopping", icon: "🛒" },
    { name: "Laundry", icon: "🧺" },
    { name: "Work", icon: "💼" },
    { name: "Socialize", icon: "👥" },
    { name: "Relax", icon: "🛋️" },
    { name: "Hobby", icon: "🎨" },
    { name: "Volunteer", icon: "🤝" },
    { name: "Self-Care", icon: "🛀" },
    { name: "Other", icon: "➕" },
  ];

export default function AddTasks({ token }) {
  const [taskType, setTaskType] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [startTime, setStartTime] = useState("08:00");
  const [anchorDate, setAnchorDate] = useState(today());
  const [submitted, setSubmitted] = useState(false);
  const [jellyfishList, setJellyfishList] = useState([]);

  const isWeekends = frequency === "weekends";

  // Spawn a jellyfish
  const spawnJellyfish = () => {
    const id = Date.now() + Math.random();
    const top = 20 + Math.random() * 50;
    const size = 50 + Math.random() * 40;

    setJellyfishList((prev) => [...prev, { id, top, size }]);

    setTimeout(() => {
      setJellyfishList((prev) => prev.filter((j) => j.id !== id));
    }, 6000); // matches animation duration
  };

  // Handle Add Task
  const handleSubmit = async () => {
    if (!taskType.trim()) return;
try {
      await apiCreateTask(
        token,
taskType.trim(),
          frequency,
          startTime,
        isWeekends ? null : anchorDate,
);

    // Spawn 2-3 jellyfish at once for fun
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      spawnJellyfish();
    }

    setTaskType("");
    setFrequency("daily");
setStartTime("08:00");
      setAnchorDate(today());
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
} catch {}
  };

  return (
    <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Add a Task</h2>
      <p style={styles.sectionDesc}>Choose a habit or create your own.</p>

      <div style={styles.card}>
{/* Task Buttons */}
        <div style={styles.taskGrid}>
          {commonTasks.map((task) => (
            <button
              key={task.name}
              style={{
                ...styles.taskBtn,
                ...(taskType === task.name ? styles.taskBtnActive : {}),
              }}
              onClick={() => setTaskType(task.name === "Other" ? "" : task.name)}
            >
              <div style={{ fontSize: "20px" }}>{task.icon}</div>
              <div>{task.name}</div>
            </button>
          ))}
        </div>

        {/* Custom Task Input */}
        {taskType === "" && (
          <div style={styles.field}>
            <label style={styles.label}>Custom Task</label>
            <input
              style={styles.input}
              placeholder="Type your task..."
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            />
          </div>
        )}

{/* Frequency Buttons */}
        <div style={styles.field}>
          <label style={styles.label}>Frequency</label>
          <div style={styles.freqGrid}>
            {FREQ_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                style={{
                  ...styles.freqBtn,
                  ...(frequency === value ? styles.freqBtnActive : {}),
                }}
                onClick={() => setFrequency(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Time */}
        <div style={styles.field}>
          <label style={styles.label}>Start Time</label>
          <input
            type="time"
            style={styles.input}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        {/* Start Day — hidden for weekends (pattern is always Sat + Sun) */}
        {!isWeekends && (
          <div style={styles.field}>
            <label style={styles.label}>Start Day</label>
            <input
              type="date"
              style={styles.input}
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
            />
          </div>
        )}

        <button style={styles.primaryBtn} onClick={handleSubmit}>
          {submitted ? "🎉 Task Added!" : "Add Task"}
        </button>
      </div>

            {jellyfishList.map((j) => (
        <img
          key={j.id}
          src="/jellyfish-removebg-preview.png"
          alt="jellyfish"
          style={{
            position: "fixed",
            top: `${j.top}%`,
            left: "-120px",
            width: `${j.size}px`,
            height: "auto",
            pointerEvents: "none",
            zIndex: 999,
            filter: "drop-shadow(0 0 12px rgba(173,216,230,0.9))",
            animation: "jellyAcross 6s linear forwards",
          }}
        />
      ))}
    </div>
  );
}