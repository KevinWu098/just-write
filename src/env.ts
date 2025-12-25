import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const NODE_ENV = z.enum(["development", "production"]);

export const env = createEnv({
    client: {
        NEXT_PUBLIC_NODE_ENV: NODE_ENV,
        NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    },
    server: {
        NODE_ENV: NODE_ENV,
        CONVEX_DEPLOYMENT: z.string().min(1),
        CLERK_SECRET_KEY: z.string().min(1),
        CLERK_JWT_ISSUER_DOMAIN: z.string().min(1),
    },
    runtimeEnv: {
        NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NODE_ENV: process.env.NODE_ENV,
        CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        CLERK_JWT_ISSUER_DOMAIN: process.env.CLERK_JWT_ISSUER_DOMAIN,
    },
});
