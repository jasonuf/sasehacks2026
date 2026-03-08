import { useState, useEffect } from "react";
import styles from "../styles/styles";
import { apiGetFriends, apiAddFriend, apiGetFriendsMissed } from "../utils/api";

export default function Friends({ token, onFriendsChange }) {
  // GET /friends returns string[] of emails
  const [friendEmails, setFriendEmails] = useState([]);
  // GET /friends/missed returns [{friend_email, friend_username, missed_tasks}]
  const [missedByEmail, setMissedByEmail] = useState({});
  const [emailInput, setEmailInput] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [expanded, setExpanded] = useState(null);

  const loadFriends = async () => {
    try {
      const [emails, missed] = await Promise.all([
        apiGetFriends(token),
        apiGetFriendsMissed(token),
      ]);
      setFriendEmails(emails);
      const map = {};
      for (const f of missed) {
        map[f.friend_email] = f;
      }
      setMissedByEmail(map);
    } catch {}
  };

  useEffect(() => {
    loadFriends();
  }, [token]);

  const sendRequest = async () => {
    try {
      await apiAddFriend(token, emailInput.trim());
      setReqMsg("Friend added!");
      setEmailInput("");
      await loadFriends();
      onFriendsChange();
    } catch (err) {
      setReqMsg(err.message || "Could not add friend.");
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Friends</h2>

      {/* Add Friend */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add a Friend</h3>

        <div style={styles.inlineRow}>
          <input
            style={{ ...styles.input, flex: 1 }}
            placeholder="friend@email.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendRequest()}
          />

          <button style={styles.primaryBtn} onClick={sendRequest}>
            Request
          </button>
        </div>

        {reqMsg && (
          <p
            style={{
              marginTop: 8,
              color: reqMsg.includes("added") ? "#4ade80" : "#f87171",
              fontSize: 13,
            }}
          >
            {reqMsg}
          </p>
        )}
      </div>

      {/* Friends List */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>My Friends ({friendEmails.length})</h3>

        {friendEmails.length === 0 && (
          <p style={styles.empty}>No friends yet — send a request!</p>
        )}

        {friendEmails.map((email) => {
          const missedInfo = missedByEmail[email];
          const missed = missedInfo?.missed_tasks ?? [];
          // Use username from missed data if available, else email prefix
          const displayName = missedInfo?.friend_username ?? email.split("@")[0];
          const isOpen = expanded === email;

          return (
            <div key={email} style={styles.friendBlock}>
              <button
                style={styles.friendHeader}
                onClick={() => setExpanded(isOpen ? null : email)}
              >
                <div style={styles.friendMeta}>
                  <span style={styles.friendAvatar}>
                    {displayName[0].toUpperCase()}
                  </span>

                  <div>
                    <span style={styles.friendName}>@{displayName}</span>

                    <span
                      style={{
                        ...styles.friendStat,
                        color: missed.length ? "#f87171" : "#4ade80",
                      }}
                    >
                      {missed.length > 0
                        ? `${missed.length} missed today`
                        : "all on track today"}
                    </span>
                  </div>
                </div>

                <span style={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div style={styles.friendTasks}>
                  {missed.length === 0 && (
                    <div style={styles.friendTask}>
                      <span
                        style={{ ...styles.taskDot, background: "#4ade80" }}
                      />
                      <span style={styles.taskName}>
                        All tasks completed today!
                      </span>
                    </div>
                  )}

                  {missed.map((t, i) => (
                    <div key={i} style={styles.friendTask}>
                      <span
                        style={{ ...styles.taskDot, background: "#f87171" }}
                      />
                      <span style={styles.taskName}>{t.title}</span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: 12,
                          color: "#f87171",
                        }}
                      >
                        Not done
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
