import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const NODE_ENV = z.enum(["development", "production"]);

export const env = createEnv({
    server: {
        NODE_ENV: NODE_ENV,
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
    },
});
