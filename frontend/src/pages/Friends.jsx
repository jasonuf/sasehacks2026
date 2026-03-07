import { useState } from "react";
import styles from "../styles/styles";
import { today } from "../utils/date";
import { isFailedToday } from "../utils/taskUtils";

export default function Friends({ user, users, updateUser, setUsers, session }) {
  const [emailInput, setEmailInput] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [expanded, setExpanded] = useState(null);

  const sendRequest = () => {
    const target = Object.values(users).find(
      (u) => u.email === emailInput.trim()
    );

    if (!target) {
      setReqMsg("No user found with that email.");
      return;
    }

    if (target.username === session.username) {
      setReqMsg("That's you!");
      return;
    }

    if (user.friends.includes(target.username)) {
      setReqMsg("Already friends.");
      return;
    }

    if (target.friendRequests.includes(session.username)) {
      setReqMsg("Request already sent.");
      return;
    }

    setUsers((prev) => ({
      ...prev,
      [target.username]: {
        ...prev[target.username],
        friendRequests: [
          ...prev[target.username].friendRequests,
          session.username,
        ],
      },
    }));

    setReqMsg(`Friend request sent to ${target.username}!`);
    setEmailInput("");
  };

  const acceptRequest = (fromUsername) => {
    setUsers((prev) => ({
      ...prev,

      [session.username]: {
        ...prev[session.username],
        friends: [...prev[session.username].friends, fromUsername],
        friendRequests: prev[session.username].friendRequests.filter(
          (r) => r !== fromUsername
        ),
      },

      [fromUsername]: {
        ...prev[fromUsername],
        friends: [...prev[fromUsername].friends, session.username],
      },
    }));
  };

  const declineRequest = (fromUsername) => {
    setUsers((prev) => ({
      ...prev,
      [session.username]: {
        ...prev[session.username],
        friendRequests: prev[session.username].friendRequests.filter(
          (r) => r !== fromUsername
        ),
      },
    }));
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
              color: reqMsg.includes("sent") ? "#4ade80" : "#f87171",
              fontSize: 13,
            }}
          >
            {reqMsg}
          </p>
        )}
      </div>

      {/* Incoming Requests */}
      {user.friendRequests.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Incoming Requests</h3>

          {user.friendRequests.map((req) => (
            <div key={req} style={styles.reqRow}>
              <span style={styles.reqName}>@{req}</span>

              <button
                style={styles.acceptBtn}
                onClick={() => acceptRequest(req)}
              >
                Accept
              </button>

              <button
                style={styles.declineBtn}
                onClick={() => declineRequest(req)}
              >
                Decline
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          My Friends ({user.friends.length})
        </h3>

        {user.friends.length === 0 && (
          <p style={styles.empty}>
            No friends yet — send a request!
          </p>
        )}

        {user.friends.map((fname) => {
          const friend = users[fname];
          if (!friend) return null;

          const failures = friend.tasks.filter(isFailedToday);
          const done = friend.tasks.filter((t) =>
            t.completedDates.includes(today())
          );

          const isOpen = expanded === fname;

          return (
            <div key={fname} style={styles.friendBlock}>
              <button
                style={styles.friendHeader}
                onClick={() =>
                  setExpanded(isOpen ? null : fname)
                }
              >
                <div style={styles.friendMeta}>
                  <span style={styles.friendAvatar}>
                    {fname[0].toUpperCase()}
                  </span>

                  <div>
                    <span style={styles.friendName}>
                      @{fname}
                    </span>

                    <span
                      style={{
                        ...styles.friendStat,
                        color: failures.length
                          ? "#f87171"
                          : "#4ade80",
                      }}
                    >
                      {done.length}/{friend.tasks.length} done today
                      {failures.length > 0
                        ? ` · ${failures.length} missed`
                        : ""}
                    </span>
                  </div>
                </div>

                <span style={styles.chevron}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div style={styles.friendTasks}>
                  {friend.tasks.map((t) => {
                    const completed =
                      t.completedDates.includes(today());

                    return (
                      <div key={t.id} style={styles.friendTask}>
                        <span
                          style={{
                            ...styles.taskDot,
                            background: completed
                              ? "#4ade80"
                              : "#f87171",
                          }}
                        />

                        <span style={styles.taskName}>
                          {t.type}
                        </span>

                        <span style={styles.taskFreq}>
                          {t.frequency}
                        </span>

                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 12,
                            color: completed
                              ? "#4ade80"
                              : "#f87171",
                          }}
                        >
                          {completed ? "Done" : "Not done"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}