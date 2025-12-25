import { auth } from "@clerk/nextjs/server";

import { Client } from "@/app/[id]/client";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    await auth.protect();

    return <Client id={id} />;
}
