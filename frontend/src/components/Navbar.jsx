import styles from "../styles/styles";

export default function Navbar({ page, setPage, onLogout, username }) {
  const tabs = [
    { id: "add", label: "+ Add Tasks" },
    { id: "check", label: "✓ My Tasks" },
    { id: "friends", label: "◎ Friends" }
  ];

  return (
    <nav style={styles.nav}>
      <span style={styles.navBrand}>Accountable</span>

      <div style={styles.navTabs}>
        {tabs.map(t => (
          <button
            key={t.id}
            style={{
              ...styles.navTab,
              ...(page === t.id ? styles.navTabActive : {})
            }}
            onClick={() => setPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.navRight}>
        <span style={styles.navUser}>@{username}</span>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}