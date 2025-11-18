interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string;
  readonly VITE_REOWN_META_URL: string;
  readonly VITE_SUBGRAPH_URL: string;
  readonly VITE_FLIGHT_INSURANCE_ADDRESS: `0x${string}`;
  readonly VITE_FLIGHT_DELAY_ADDRESS: `0x${string}`;
  readonly VITE_EXPLORER_URL: string;
  readonly VITE_MOCK_DATA_PROVIDER_URL: string;
  readonly VITE_GITHUB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
