import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const NODE_ENV = z.enum(["development", "production"]);

export const env = createEnv({
    client: {
        NEXT_PUBLIC_NODE_ENV: NODE_ENV,
    },
    server: {
        NODE_ENV: NODE_ENV,
    },
    runtimeEnv: {
        NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,

        NODE_ENV: process.env.NODE_ENV,
    },
});
