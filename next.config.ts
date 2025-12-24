import "@/env";

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverComponentsExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
