// import { CinemaConfig } from "../types";

// export function sanitizeAndparseInitInput(input: string): CinemaConfig | null {
//   // Expect: [Title] [Rows] [SeatsPerRow]
//   // Example: "Inception 10 20"
//   const tokens = input.split(/\s+/);
//   if (tokens.length < 3) return null;
//   const seatsPerRow = parseInt(tokens.pop()!, 10);
//   const rows = parseInt(tokens.pop()!, 10);
//   const title = tokens.join(" ");
//   if (!title || isNaN(rows) || isNaN(seatsPerRow)) return null;
//   return { title, rows, seatsPerRow };
// }

export const getRowIndexBasedOnChar = (char: string) => {
  return char.charCodeAt(0) - 65;
};

export const getUpperCaseChar = (index: number) => {
  return String.fromCharCode(index + 65);
};

export const centerText = (text: string, width: number) => {
  const padding = Math.floor((width - text.length) / 2);
  const spaces = " ".repeat(Math.max(0, padding));
  return spaces + text;
};
