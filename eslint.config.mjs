import reactCompiler from "eslint-plugin-react-compiler";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import prettierEslintConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";

import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...tseslint.configs.strict,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],

  {
    plugins: {
      "react-compiler": reactCompiler,
      "react-hooks": hooksPlugin,
      "@next/next": nextPlugin,
    },

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      "@next/next/no-duplicate-head": "off",

      "react-compiler/react-compiler": "error",

      "no-console": "warn",
      camelcase: "warn",
      eqeqeq: "error",
    },
  },
  prettierEslintConfig,
];
