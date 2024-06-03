import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintprettier from 'eslint-config-prettier';

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
