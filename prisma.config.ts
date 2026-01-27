import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Use local SQLite for schema operations
  // Runtime uses Turso via adapter in lib/prisma.ts
  datasource: {
    url: "file:./dev.db",
  },
});
