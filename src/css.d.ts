// Declaraciones para imports de CSS (global y módulos) usados por NativeWind/web.
declare module '*.css';
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
