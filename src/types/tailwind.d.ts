
interface DarkModeConfig {
  className: string;
  attr?: string;
}

type DarkModeStrategy = 
  | 'media' 
  | 'class' 
  | ['class'] 
  | ['class', string];

declare module 'tailwindcss' {
  export interface Config {
    darkMode?: DarkModeStrategy;
    // Add other tailwind config properties as needed
  }
}
