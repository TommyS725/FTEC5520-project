import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";
dotenv.config();

const subgraphUrl = process.env.VITE_SUBGRAPH_URL;

if (!subgraphUrl) {
  throw new Error("VITE_SUBGRAPH_URL environment variable is required");
}

const scalers = {
  Bytes: "`0x${string}`",
  BigInt: "string",
  BigDecimal: "string",
};

const config: CodegenConfig = {
  schema: process.env.VITE_SUBGRAPH_URL,
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
        useTypeImports: true,
        scalers,
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
        useTypeImports: true,
        scalers,
      },
    },
  },
};

export default config;
