import { useState, useEffect, useMemo } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import Navbar from "./components/Navbar";
import FailureBanner from "./components/FailureBanner";

import AddTasks from "./pages/AddTasks";
import CheckTasks from "./pages/CheckTasks";
import Friends from "./pages/Friends";

import { seedUsers } from "./utils/seedUsers";
import { getCookie, setCookie, deleteCookie } from "./utils/cookies";
import { isFailedToday } from "./utils/taskUtils";

import styles from "./styles/styles";

const USERS_KEY = "acct_users";
const SESSION_KEY = "acct_session";

export default function App() {
  const [users, setUsers] = useState(() => seedUsers());
  const [session, setSession] = useState(() => getCookie(SESSION_KEY));
  const [page, setPage] = useState("check");
  const [loginError, setLoginError] = useState("");

  // Derived state: Get the current user object based on the session
  const currentUser = session ? users[session.username] : null;

  // Sync users to cookies whenever the users state changes
  useEffect(() => {
    setCookie(USERS_KEY, users, 30);
  }, [users]);

  const login = (username, password) => {
    const user = users[username.toLowerCase()];
    if (!user || user.password !== password) {
      setLoginError("Invalid username or password.");
      return;
    }

    const sess = { username: user.username };
    setCookie(SESSION_KEY, sess);
    setSession(sess);
    setLoginError("");
  };

  const logout = () => {
    deleteCookie(SESSION_KEY);
    setSession(null);
  };

  const updateCurrentUser = (updater) => {
    setUsers(prev => {
      const updated = { ...prev };
      // Apply the updater function to the current user's data
      updated[session.username] = updater(updated[session.username]);
      return updated;
    });
  };

  /**
   * FIX: Wrap friendFailures in useMemo.
   * This prevents the Banner from "refreshing" or "jumping" 
   * unless a friend's task actually fails.
   */
  const friendFailures = useMemo(() => {
    if (!currentUser) return [];

    return currentUser.friends.flatMap(fname => {
      const friend = users[fname];
      if (!friend) return [];
      return friend.tasks
        .filter(isFailedToday)
        .map(t => ({ friend: fname, task: t.type }));
    });
  }, [users, currentUser]);

  // If no one is logged in, show the login screen
  if (!currentUser) {
    return <LoginScreen onLogin={login} error={loginError} />;
  }

  return (
    <div style={styles.app}>
      {/* The Banner only updates if the memoized failures change */}
      <FailureBanner failures={friendFailures} />
      
      <Navbar
        page={page}
        setPage={setPage}
        onLogout={logout}
        username={currentUser.username}
      />

      <main style={styles.main}>
        {page === "add" && (
          <AddTasks user={currentUser} updateUser={updateCurrentUser} />
        )}

        {page === "check" && (
          <CheckTasks user={currentUser} updateUser={updateCurrentUser} />
        )}

        {page === "friends" && (
          <Friends
            user={currentUser}
            users={users}
            updateUser={updateCurrentUser}
            setUsers={setUsers}
            session={session}
          />
        )}
      </main>
    </div>
  );
}