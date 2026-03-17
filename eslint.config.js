import eslint from '@eslint/js';
import eslintprettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.idea/*', '.yarn/*', 'node_modules/*', 'coverage/*', 'dist/*'] },
  eslint.configs.recommended,
  eslintprettier,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
