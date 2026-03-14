/// <reference types="vite/client" />
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.png' {
  const value: any;
  export = value;
}
declare module '*.svg' {
  const value: any;
  export = value;
}
declare module '*.webp' {
  const value: any;
  export = value;
}
