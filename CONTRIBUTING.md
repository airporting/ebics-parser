# Contributing to ebics-parser

## Prerequisites

- Node.js 24.12.0 (see `.nvmrc`)
- Yarn 4.13.0 (corepack)

## Setup

```bash
corepack enable
yarn install
```

## Development workflow

```bash
# Run tests
yarn test

# Lint
yarn lint

# Format
yarn prettier:write

# Build
yarn build

# Parse an EBICS file (CLI)
yarn parse <filepath>
```

## Commit conventions

This project uses [conventional commits](https://www.conventionalcommits.org/). Use `yarn commit` (commitizen) for interactive commit messages.

Allowed prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`.

Pre-commit hooks run prettier and lint-staged automatically.

## Adding a new SEPA qualifier

1. Add the qualifier code to `QualifierType` in `src/transaction/index.ts`
2. Add the case in `src/transactionBody/qualifier/index.ts`
3. Add the corresponding fields to `ParsedTransaction` type
4. Add the fields to the Zod schema in `src/account/schema.ts`
5. Add a test case in `src/transactionBody/index.test.ts`

## Testing

Tests use Vitest with snapshot testing. Run `yarn test` to execute all tests with coverage.

When modifying parsing logic, check snapshot diffs carefully — they reflect the actual parsed output.

## Project structure

See the Architecture section in the [README](./README.md).

## Publishing

Publishing to npm happens automatically on push to `main` via GitHub Actions.
Bump the version before merging:

```bash
yarn v:patch   # bug fix
yarn v:minor   # new feature
yarn v:major   # breaking change
```
