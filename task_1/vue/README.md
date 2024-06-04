# Run the DB

```bash
docker compose up db
```

# Run the migrations and seed the DB

```bash
npm run run-migrations
npm run seed-db
```

# Run the server

Dev mode:

```bash
npm run dev
```

Prod mode:

```bash
npm run build
npm run preview
```

# Run the integration tests

Dev mode:

```bash
npm run test:dev
```

Prod mode:

```bash
npm run build
npm run test
```
