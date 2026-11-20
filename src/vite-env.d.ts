/// <reference types="vite/client" />

/** Version de package.json, injectée au build par vite.config.ts. */
declare const __APP_VERSION__: string

/** Configuration d'un jeu, transformée en objet au build (plugin `masterscards-yaml` de vite.config.ts). */
declare module '*.yaml' {
  const value: unknown
  export default value
}
