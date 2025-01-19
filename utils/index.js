export function convertToReadableDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "long", // e.g., "Monday"
    year: "numeric", // e.g., "2025"
    month: "long", // e.g., "January"
    day: "numeric", // e.g., "18"
    hour: "2-digit", // e.g., "8 PM"
    minute: "2-digit", // e.g., "09"
    second: "2-digit", // e.g., "13"
    hour12: true, // For 12-hour format; set to false for 24-hour format
  });
}
