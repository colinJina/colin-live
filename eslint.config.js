import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
    {
        ignores: ['dist', 'node_modules', 'vite.config.ts'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        plugins: {
            'react-hooks': reactHooks,
            react: react,
            import: importPlugin,
            'unused-imports': unusedImports,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: { ...globals.browser, ...globals.node },
        },
        settings: {
            react: { version: 'detect' }, // 自动检测 React 版本
        },
        rules: {
            // --- 核心逻辑保护 ---
            ...reactHooks.configs.recommended.rules,
            'react/jsx-key': 'error', // 循环必须带 key，防止 React 渲染 Bug

            // --- 自动化的力量：Import 排序 ---
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc' },
                },
            ],

            // --- 自动清理：删除未使用的导入 ---
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // --- 适度宽松，但保留底线 ---
            semi: ['error', 'always'], // 强制分号，保证代码风格一致
            '@typescript-eslint/no-explicit-any': 'warn', // 别关死，改成 warn 提醒大家少写 any
            'no-console': ['warn', { allow: ['warn', 'error'] }], // 允许 error，但普通 log 建议清理
        },
    },
);
