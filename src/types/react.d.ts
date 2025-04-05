
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare namespace React {
  type ReactNode = 
    | React.ReactElement 
    | string 
    | number 
    | boolean 
    | null 
    | undefined 
    | React.ReactNodeArray 
    | React.ReactPortal;
  
  type ReactNodeArray = Array<ReactNode>;
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
    T extends JSXElementConstructor<infer P>
      ? P
      : T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : {};
  
  interface FC<P = {}> {
    (props: P): ReactElement | null;
    displayName?: string;
  }
  
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    className?: string;
    style?: CSSProperties;
    [key: string]: any;
  }
  
  interface CSSProperties {
    [key: string]: string | number | undefined;
  }
  
  interface DOMAttributes<T> {
    children?: ReactNode;
    onClick?: (event: SyntheticEvent) => void;
    onChange?: (event: SyntheticEvent) => void;
    onSubmit?: (event: SyntheticEvent) => void;
    [key: string]: any;
  }
  
  interface SyntheticEvent {
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget;
  }
  
  interface EventTarget {
    value?: any;
    [key: string]: any;
  }
  
  type Key = string | number;
  
  type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement | null)
    | (new (props: P) => Component<P, any>);

  class Component<P = {}, S = {}> {
    constructor(props: P);
    state: S;
    props: P;
    setState: (state: S | ((prevState: S, props: P) => S), callback?: () => void) => void;
    render(): ReactNode;
  }
  
  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement<any, any> { }
  }
}
