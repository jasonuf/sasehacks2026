import { useState, useEffect, useCallback } from "react";
import "./App.css";

import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import Navbar from "./components/Navbar";
import FailureBanner from "./components/FailureBanner";

import AddTasks from "./pages/AddTasks";
import CheckTasks from "./pages/CheckTasks";
import Friends from "./pages/Friends";

import { getCookie, setCookie, deleteCookie } from "./utils/cookies";
import { apiLogin, apiRegister, apiGetFriendsMissed } from "./utils/api";

import styles from "./styles/styles";

const SESSION_KEY = "acct_session";

export default function App() {
  const [session, setSession] = useState(() => getCookie(SESSION_KEY));
  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("check");

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [friendFailures, setFriendFailures] = useState([]);

  const token = session?.token;
  const username = session?.username;

  // Load friend failures
  const loadFriendsMissed = useCallback(async () => {
    if (!token) return;

    try {
      const missed = await apiGetFriendsMissed(token);

      const failures = missed.flatMap((f) =>
        f.missed_tasks.map((t) => ({
          friend: f.friend_username,
          task: t.title,
        }))
      );

      setFriendFailures(failures);
    } catch {
      console.log("Failed to load friend failures");
    }
  }, [token]);

  useEffect(() => {
    loadFriendsMissed();
  }, [loadFriendsMissed]);

  // LOGIN
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);

      const sess = {
        token: data.access_token,
        username: email,
      };

      setCookie(SESSION_KEY, sess);
      setSession(sess);
      setLoginError("");
    } catch {
      setLoginError("Invalid email or password.");
    }
  };

  // REGISTER
  const register = async (email, username, password) => {
    try {
      await apiRegister(email, username, password);

      const data = await apiLogin(email, password);

      const sess = {
        token: data.access_token,
        username,
      };

      setCookie(SESSION_KEY, sess);
      setSession(sess);
      setRegisterError("");
    } catch (err) {
      setRegisterError(err.message || "Registration failed.");
    }
  };

  // LOGOUT
  const logout = () => {
    deleteCookie(SESSION_KEY);
    setSession(null);
  };

  // AUTH SCREENS
  if (!session) {
    if (authPage === "register") {
      return (
        <RegisterScreen
          onRegister={register}
          onSwitchToLogin={() => {
            setRegisterError("");
            setAuthPage("login");
          }}
          error={registerError}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={login}
        onSwitchToRegister={() => {
          setLoginError("");
          setAuthPage("register");
        }}
        error={loginError}
      />
    );
  }

  // MAIN APP
  return (
    <div style={styles.app}>
      <FailureBanner failures={friendFailures} />

      <Navbar
        page={page}
        setPage={setPage}
        onLogout={logout}
        username={username}
      />

      <main style={styles.main}>
        {page === "add" && <AddTasks token={token} />}

        {page === "check" && <CheckTasks token={token} />}

        {page === "friends" && (
          <Friends token={token} onFriendsChange={loadFriendsMissed} />
        )}
      </main>
    </div>
  );
}