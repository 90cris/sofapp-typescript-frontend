/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_URL_BACKEND: string;
    // puedes agregar más variables si tienes otras en .env
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  