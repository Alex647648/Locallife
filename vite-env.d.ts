/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DYNAMIC_ENV_ID?: string;
  // Add other VITE_ prefixed env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
