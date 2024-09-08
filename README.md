# Next Starter Repo

## Setup

1. Install nvm: https://github.com/nvm-sh/nvm
2. Install bun: https://bun.sh/docs/installation
3. install newest version of node:

```bash
nvm install node
```

and then use that version with:

```bash
nvm use node
```

4. clone the repo
5. install dependencies:

```bash
bun install
```

6. Run in development mode

```bash
bun dev
```

## Tests

```bash
bun run test
```

## Production build

```bash
bun run build
```

## Serve production build

```bash
bun run start
```

## Database

### Drizzle Studio

to fire up drizzle studio run:

```bash
bunx drizzle-kit studio
```

### Generating migration

to generate a migration after schema changes

```bash
bunx drizzle-kit generate
```

### Migration

to migrate all migrations run:

```bash
bunx drizzle-kit migrate
```
