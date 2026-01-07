import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  // JavaScript 推荐配置
  js.configs.recommended,
  // TypeScript 文件配置
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
    },
    rules: {
      'no-undef': 'off',
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Vue 文件配置
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        // 使用 TypeScript 解析器处理脚本部分
        parser: {
          ts: tsparser,
        },
      },
    },
    plugins: {
      vue,
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
  // 忽略文件
  {
    ignores: ['dist/**', 'node_modules/**', 'main.js', '*.css'],
  },
];
