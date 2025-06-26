// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigAsPlugin } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react: fixupConfigAsPlugin(pluginReactConfig),
      "@next/next": nextPlugin, // next/eslint-plugin-next をプラグインとして追加
    },
    rules: {
      // --- ここにルールを追加・変更します ---

      // 例1: 未使用の変数に関する警告をオフにする (非推奨ですが一時的に)
      "@typescript-eslint/no-unused-vars": "off",

      // 例2: React Hookの依存関係に関する警告をオフにする
      "react-hooks/exhaustive-deps": "off",

      // 例3: コンポーネントの表示名に関する警告をオフにする
      "react/display-name": "off",

      // 例4: 無名デフォルトエクスポートに関する警告をオフにする
      "import/no-anonymous-default-export": "off",

      // 例5: <img>タグの使用に関するNext.jsの警告をオフにする
      "@next/next/no-img-element": "off",

      // 例6: その他、個別に調整したいルールがあれば追加
      // 例えば、セミコロンを必須にしない:
      // "semi": ["error", "never"]
    }
  }
];