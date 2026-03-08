# Frontend API Integration Guide
> This file tells Claude Code how to structure all requests to the backend API.

## Base URL
```
http://localhost:8000
```
For production, replace with your deployed URL.

---

## Authentication

The API uses **JWT Bearer tokens**. After login, store the token and attach it to every protected request.

### Store the token (React)
```javascript
// After login, save to state or context (do NOT use localStorage in Claude artifacts)
const [token, setToken] = useState(null);

// On login success:
setToken(data.access_token);
```

### Attach token to requests
```javascript
const authHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};
```

---

## API Routes

### POST /auth/register
Create a new user account. No auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "alice@example.com",   // string, valid email
    username: "alice",            // string
    password: "secret123"         // string
  })
});
const user = await res.json();
```

**Response (201):**
```json
{
  "id": "6840a1b2c3d4e5f6a7b8c9d0",
  "email": "alice@example.com",
  "username": "alice"
}
```

**Errors:**
- `409` — Email already registered

---

### POST /auth/login
Log in and receive a JWT token. No auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "alice@example.com",
    password: "secret123"
  })
});
const { access_token } = await res.json();
// Save access_token to your auth state
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401` — Invalid email or password

---

### GET /tasks
Get all tasks for the currently logged-in user. 🔒 Auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/tasks", {
  headers: authHeaders
});
const tasks = await res.json();
```

**Response (200):**
```json
[
  {
    "id": "6840a1b2c3d4e5f6a7b8c9d0",
    "title": "Morning run",
    "frequency": "every_2_days",
    "start_time": "08:00",
    "anchor_date": "2024-01-01",
    "next_due_at": "2024-01-03T08:00:00",
    "is_overdue": false
  }
]
```

---

### POST /tasks
Create a new task. 🔒 Auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/tasks", {
  method: "POST",
  headers: authHeaders,
  body: JSON.stringify({
    title: "Morning run",
    frequency: "every_2_days",  // "daily" | "every_2_days" | "every_3_days" | "weekends"
    start_time: "08:00",        // HH:MM, 24-hour (default "08:00")
    anchor_date: "2024-01-01"   // YYYY-MM-DD, ignored for "weekends" (optional, defaults to today)
  })
});
const task = await res.json();
```

**Response (201):**
```json
{
  "id": "6840a1b2c3d4e5f6a7b8c9d0",
  "title": "Morning run",
  "frequency": "every_2_days",
  "start_time": "08:00",
  "anchor_date": "2024-01-01",
  "next_due_at": "2024-01-03T08:00:00",
  "is_overdue": false
}
```

---

### DELETE /tasks/{task_id}
Delete a task by ID. 🔒 Auth required.

**Request:**
```javascript
const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
  method: "DELETE",
  headers: authHeaders
});
// Returns 204 No Content on success
```

**Errors:**
- `404` — Task not found or doesn't belong to current user

---

### POST /tasks/{task_id}/checkin
Mark a task as completed. Resets the `next_due_at` countdown. 🔒 Auth required.

**Request:**
```javascript
const res = await fetch(`http://localhost:8000/tasks/${taskId}/checkin`, {
  method: "POST",
  headers: authHeaders
});
const updatedTask = await res.json();
```

**Response (200):** Returns the updated task object with the new `next_due_at`.

**Errors:**
- `404` — Task not found

---

### POST /friends
Add a friend by their email address. 🔒 Auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/friends", {
  method: "POST",
  headers: authHeaders,
  body: JSON.stringify({
    email: "bob@example.com"   // must be a registered user's email
  })
});
// Returns 204 No Content on success
```

**Errors:**
- `404` — No user found with that email
- `400` — Can't add yourself
- `409` — Already friends

---

### GET /friends
Get the list of your friend emails. 🔒 Auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/friends", {
  headers: authHeaders
});
const friendEmails = await res.json(); // string[]
```

**Response (200):**
```json
["bob@example.com", "carol@example.com"]
```

---

### GET /friends/missed
⭐ **The banner route.** Returns all friends who have at least one overdue task.
Call this on every page load (except login). 🔒 Auth required.

**Request:**
```javascript
const res = await fetch("http://localhost:8000/friends/missed", {
  headers: authHeaders
});
const missed = await res.json();
```

**Response (200):**
```json
[
  {
    "friend_email": "bob@example.com",
    "friend_username": "bob",
    "missed_tasks": [
      {
        "title": "Morning run",
        "overdue_since": "2024-01-01T08:00:00"
      }
    ]
  }
]
```

Show the notification banner if `missed.length > 0`. Hide it if the array is empty.

---

## React Integration Pattern

### Auth Context
```javascript
// contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setToken(data.access_token);
  };

  const logout = () => { setToken(null); setUser(null); };

  const authFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers
      }
    });

  return (
    <AuthContext.Provider value={{ token, user, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Missed Tasks Banner
```javascript
// components/MissedBanner.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function MissedBanner() {
  const { authFetch } = useAuth();
  const [missed, setMissed] = useState([]);

  useEffect(() => {
    authFetch("http://localhost:8000/friends/missed")
      .then(r => r.json())
      .then(setMissed)
      .catch(() => {});
  }, []);

  if (missed.length === 0) return null;

  return (
    <div className="banner">
      {missed.map(({ friend_username, missed_tasks }) => (
        <p key={friend_username}>
          ⚠️ <strong>{friend_username}</strong> missed:{" "}
          {missed_tasks.map(t => t.title).join(", ")}
        </p>
      ))}
    </div>
  );
}
```

Place `<MissedBanner />` in your root layout component so it appears on every page except login.

---

## Error Handling

All error responses follow this shape:
```json
{ "detail": "Human readable error message" }
```

Recommended pattern:
```javascript
const res = await fetch(...);
if (!res.ok) {
  const err = await res.json();
  throw new Error(err.detail || "Something went wrong");
}
const data = await res.json();
```

---

## Data Types Reference

| Field | Type | Values |
|-------|------|--------|
| `frequency` | string enum | `"daily"`, `"every_2_days"`, `"every_3_days"`, `"weekends"` |
| `start_time` | string | `"HH:MM"` 24-hour format, e.g. `"08:00"` |
| `anchor_date` | ISO 8601 date string or null | e.g. `"2024-01-01"`. `null` for `"weekends"` |
| `next_due_at` | ISO 8601 datetime string | e.g. `"2024-01-02T08:00:00"` |
| `is_overdue` | boolean | `true` if `next_due_at` is in the past |
| `id` | string | MongoDB ObjectId as hex string |

---

## Notes for Claude Code

- All IDs are MongoDB ObjectId strings (24-char hex). Never hardcode or guess them.
- The token expires after **72 hours**. Redirect to `/login` on a `401` response.
- `frequency` must be exactly `"daily"`, `"every_2_days"`, `"every_3_days"`, or `"weekends"` — no other values are accepted.
- `start_time` must be `"HH:MM"` 24-hour format. Defaults to `"08:00"` if omitted.
- `anchor_date` must be `"YYYY-MM-DD"`. Omit or set to `null` for `"weekends"`. Defaults to today if omitted for interval frequencies.
- Do not use `localStorage` for token storage in Claude artifacts — use React state or context.
- The `/friends/missed` route should be polled on **every page load**, not on an interval.
- `DELETE /tasks/{id}` returns `204 No Content` — don't try to parse the response body.
- `POST /friends` and task checkin also return `204` — same rule applies.