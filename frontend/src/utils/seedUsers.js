import { getCookie, setCookie } from "./cookies";
import { today, yesterday } from "./date";

const USERS_KEY = "acct_users";

export function seedUsers() {
  const existing = getCookie(USERS_KEY);
  if (existing) return existing;

  const users = {
    alice: {
      username: "alice",
      password: "pass",
      email: "alice@example.com",
      tasks: [
        { id: 1, type: "Exercise", frequency: "Daily", completedDates: [today(), yesterday()] },
        { id: 2, type: "Read", frequency: "Weekly", completedDates: [] }
      ],
      friends: ["bob"],
      friendRequests: []
    },
    bob: {
      username: "bob",
      password: "pass",
      email: "bob@example.com",
      tasks: [
        { id: 1, type: "Meditate", frequency: "Daily", completedDates: [] },
        { id: 2, type: "Gym", frequency: "3x/week", completedDates: [yesterday()] }
      ],
      friends: ["alice"],
      friendRequests: []
    }
  };

  setCookie(USERS_KEY, users, 30);
  return users;
}