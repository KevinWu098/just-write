import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const NODE_ENV = z.enum(["development", "production"]);

export const env = createEnv({
    client: {
        NEXT_PUBLIC_NODE_ENV: NODE_ENV,
        NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
    },
    server: {
        NODE_ENV: NODE_ENV,
        CONVEX_DEPLOYMENT: z.string().min(1),
    },
    runtimeEnv: {
        NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
        NODE_ENV: process.env.NODE_ENV,
        CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    },
});
