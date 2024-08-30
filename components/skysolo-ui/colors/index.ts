import Colors from "./skysolo.color.json";
export type ThemeSchema = "light" | "dark"
export type ThemeNames = "Blue" | "State" | "Stone" | "Zinc" | "Violet" | "Green" | "Red" | "Orange" | "Yellow" | "Rose"
export type ColorsProp = {
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  popover: string;
  popover_foreground: string;
  primary: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  muted: string;
  muted_foreground: string;
  accent: string;
  accent_foreground: string;
  destructive: string;
  destructive_foreground: string;
  border: string;
  input: string;
  ring: string;
  radius?: string;
  chart_1?: string;
  chart_2?: string;
  chart_3?: string;
  chart_4?: string;
  chart_5?: string;
};

export { Colors };