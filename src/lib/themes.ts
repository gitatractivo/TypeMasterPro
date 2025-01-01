export type Theme = {
  name: string;
  label: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    correct: string;
    cursor: string;
  };
};

export const themes: Theme[] = [
  {
    name: "default",
    label: "Default",
    colors: {
      background: "#f0f0f0",
      text: "#1a1a1a",
      primary: "#2563eb",
      secondary: "#475569",
      accent: "#0ea5e9",
      error: "#dc2626",
      correct: "#16a34a",
      cursor: "#000000",
    },
  },
  {
    name: "dark",
    label: "Dark",
    colors: {
      background: "#1a1a1a",
      text: "#f0f0f0",
      primary: "#3b82f6",
      secondary: "#94a3b8",
      accent: "#38bdf8",
      error: "#ef4444",
      correct: "#22c55e",
      cursor: "#ffffff",
    },
  },
  {
    name: "monokai",
    label: "Monokai",
    colors: {
      background: "#272822",
      text: "#f8f8f2",
      primary: "#66d9ef",
      secondary: "#a6e22e",
      accent: "#fd971f",
      error: "#f92672",
      correct: "#a6e22e",
      cursor: "#f8f8f2",
    },
  },
];

export const THEME_STORAGE_KEY = "typing_game_theme";
