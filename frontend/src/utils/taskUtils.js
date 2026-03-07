import { today } from "./date";

export function isFailedToday(task) {
  if (task.frequency === "Daily") {
    return !task.completedDates.includes(today());
  }
  return false;
}