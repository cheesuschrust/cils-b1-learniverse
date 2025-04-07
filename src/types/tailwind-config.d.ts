
declare module 'tailwindcss' {
  export interface Config {
    darkMode?: 'media' | 'class' | ['class'] | ['class', string];
    content?: string[];
    theme?: Record<string, any>;
    plugins?: any[];
    prefix?: string;
  }
}
