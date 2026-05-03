import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade any error to warn for flexibility
      "react/display-name": "off", // Disable display-name check as it's often noisy in HOCs
    }
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];


export default eslintConfig;
