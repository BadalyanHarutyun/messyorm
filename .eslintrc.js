module.exports = {
    env: {
      "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": "./tsconfig.json",
      "tsconfigRootDir": __dirname
    },
    "plugins": ["@typescript-eslint", "prettier"],
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ],
    "rules": {
      "prettier/prettier": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "off"
    },
    "overrides": [
      {
        "files": ["*.ts"]
        
      }
    ],
    "ignorePatterns":["node_modules",".eslintrc.js","dist"]
 }