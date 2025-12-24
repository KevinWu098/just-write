import fs from "node:fs/promises";

import { readMigrationFiles } from "drizzle-orm/migrator";

import { BASE } from "../../../drizzle.config";

const migrationsFolder = `${BASE}/migrations`;
const file = `${BASE}/migrations/export.json`;

await fs.writeFile(
    `${file}`,
    JSON.stringify(
        readMigrationFiles({
            migrationsFolder,
        }),
        null,
        0
    ),
    {
        flag: "w",
    }
);
