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

export default eslintConfig;
