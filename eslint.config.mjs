import { createRequire } from "node:module";
import { defineConfig, globalIgnores } from "eslint/config";

const require = createRequire(import.meta.url);

function loadFlatConfig(id) {
  const mod = require(id);
  const value = mod?.default ?? mod;
  return Array.isArray(value) ? value : [];
}

const eslintConfig = defineConfig([
  ...loadFlatConfig("eslint-config-next/core-web-vitals"),
  ...loadFlatConfig("eslint-config-next/typescript"),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
