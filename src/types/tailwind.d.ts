
interface DarkModeConfig {
  className: string;
  attr?: string;
}

type DarkModeStrategy = 
  | 'media' 
  | 'class' 
  | ['class', string]
  | 'selector';

declare module 'tailwindcss' {
  export interface Config {
    darkMode?: DarkModeStrategy;
    content?: string[];
    theme?: {
      extend?: Record<string, any>;
      [key: string]: any;
    };
    plugins?: any[];
    preflight?: boolean;
    corePlugins?: {
      [key: string]: boolean;
    } | string[];
  }
  
  const tailwindcss: {
    (config?: Partial<Config>): any;
    config: {
      (config: Partial<Config>): Partial<Config>;
    };
    defaultConfig: Record<string, any>;
    plugin: (handler: any) => any;
  };
  
  export default tailwindcss;
}
