import { useState } from "react";
import styles from "../styles/styles";

export default function AddTasks({ user, updateUser }) {
  const [taskType, setTaskType] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [submitted, setSubmitted] = useState(false);

  const freqOptions = ["Daily", "Weekly", "3x/week", "Weekdays", "Custom"];
  
  const commonTasks = [
    { name: "Exercise", icon: "🏋️" },{ name: "Read", icon: "📚" },{ name: "Meditate", icon: "🧘" },
    { name: "Cook", icon: "🍳" },{ name: "Sleep", icon: "😴" },{ name: "Shower", icon: "🚿" },
    { name: "Drink Water", icon: "🚰" },{ name: "Write", icon: "✍️" },{ name: "Cleaning", icon: "🧹" },
    { name: "Study", icon: "📖"},{name: "Brush Teeth", icon: "🦷"},{name: "Take out Trash", icon: "🗑️"},
    { name: "Grocery Shopping", icon: "🛒"},{name: "Laundry", icon: "🧺"},{name: "Work", icon: "💼"},
    { name: "Socialize", icon: "👥"},{name: "Relax", icon: "🛋️"},{name: "Hobby", icon: "🎨"},
    { name: "Volunteer", icon: "🤝" },{ name: "Self-Care", icon: "🛀" }, {name: "Other", icon: "➕"},
  ];
  const spawnJellyfish = () => {
    const id = Date.now() + Math.random(); // unique ID
    const top = 20 + Math.random() * 50; // random vertical position
    const size = 50 + Math.random() * 40; // random size

    setJellyfishList(prev => [...prev, { id, top, size }]);

    // remove after 6s (animation duration)
    setTimeout(() => {
      setJellyfishList(prev => prev.filter(j => j.id !== id));
    }, 6000);
  };

  const handleSubmit = () => {
    if (!taskType.trim()) return;

    updateUser(u => ({
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

    spawnJellyfish(); 

    setTaskType("");
    setFrequency("Daily");

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Add a Task</h2>
      <p style={styles.sectionDesc}>Choose a habit or create your own.</p>

      <div style={styles.card}>
        <div style={styles.taskGrid}>
          {commonTasks.map((task) => (
            <button
              key={task.name}
              style={{
                ...styles.taskBtn,
                ...(taskType === task.name ? styles.taskBtnActive : {}),
              }}
              onClick={() =>
                setTaskType(task.name === "Other" ? "" : task.name)
              }
            >
              <div style={{ fontSize: "20px" }}>{task.icon}</div>
              <div>{task.name}</div>
            </button>
          ))}
        </div>

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

        {/* Submit Button */}
        <button style={styles.primaryBtn} onClick={handleSubmit}>
          {submitted ? "🎉 Task Added!" : "Add Task "}
        </button>
      </div>

      {/* Jellyfish Floating */}
      {jellyfishList.map((j) => (
        <img
          key={j.id}
          src="jellyfish-removebg-preview.png"
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