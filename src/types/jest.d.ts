
declare module 'jest' {
  export interface Config {
    [key: string]: any;
  }
}

declare module 'ts-jest' {
  export interface InitialOptionsTsJest {
    [key: string]: any;
  }
}
