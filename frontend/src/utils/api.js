const BASE = "http://localhost:8000";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Human labels → API values
export const FREQ_OPTIONS = [
  { label: "Daily",       value: "daily" },
  { label: "Every 2 Days", value: "every_2_days" },
  { label: "Every 3 Days", value: "every_3_days" },
  { label: "Weekends",    value: "weekends" },
];

export const FREQ_LABEL = Object.fromEntries(
  FREQ_OPTIONS.map(({ label, value }) => [value, label])
);

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function apiRegister(email, username, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

export async function apiGetTasks(token) {
  const res = await fetch(`${BASE}/tasks`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function apiCreateTask(token, title, frequency, startTime, anchorDate) {
  const body = { title, frequency, start_time: startTime };
  if (anchorDate) body.anchor_date = anchorDate;
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function apiCheckinTask(token, taskId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/checkin`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to check in");
  return res.json();
}

export async function apiUncheckinTask(token, taskId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/checkin`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to uncheck");
  return res.json();
}

export async function apiGetFriends(token) {
  const res = await fetch(`${BASE}/friends`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json(); // returns string[] of emails
}

export async function apiAddFriend(token, email) {
  const res = await fetch(`${BASE}/friends`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add friend");
  }
  // 204 No Content — no body to parse
}

export async function apiGetFriendsMissed(token) {
  const res = await fetch(`${BASE}/friends/missed`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch missed tasks");
  return res.json();
}
