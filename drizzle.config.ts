import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export const BASE = "./src/db";

export default defineConfig({
    out: `${BASE}/migrations`,
    schema: `${BASE}/schema.ts`,
    dialect: "postgresql",
    migrations: { prefix: "timestamp" },
});
