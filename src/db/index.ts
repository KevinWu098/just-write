import { PGlite } from "@electric-sql/pglite";
import { PgDialect } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";

import migrations from "@/db/migrations/export.json";
import * as schema from "@/db/schema";
import { env } from "@/env";

const IS_PRODUCTION = env.NEXT_PUBLIC_NODE_ENV === "production";
const DB_NAME = IS_PRODUCTION ? "just-write" : "just-write-dev";

let dbPromise: Promise<any> | null = null;

async function initializeDB() {
    if (typeof window === "undefined") {
        // Return a mock on the server side
        throw new Error("Database can only be initialized in the browser");
    }

    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = (async () => {
        const client = await PGlite.create({
            dataDir: `idb://${DB_NAME}`,
        });

        const _db = drizzle(client, {
            schema,
            logger: !IS_PRODUCTION,
        });

        const start = performance.now();
        try {
            await new PgDialect().migrate(
                migrations,
                // https://github.com/rphlmr/drizzle-on-indexeddb/blob/f789e3334c6fe84f6a079c903b0ff529974861dc/app/database/.client/db.ts#L29
                // @ts-expect-error 🤷 don't know why db._.session is not a Session
                _db._.session,
                DB_NAME
            );
            console.info(
                `✅ Local database ready in ${performance.now() - start}ms`
            );
        } catch (cause) {
            console.error("❌ Local database schema migration failed", cause);
            throw cause;
        }

        return Object.assign(_db, {
            schema,
        });
    })();

    return dbPromise;
}

export { initializeDB };
export type DB = Awaited<ReturnType<typeof initializeDB>>;
