/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly OPENAI_API_BASE: string
  readonly OPENAI_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
