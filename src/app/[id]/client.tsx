"use client";

import dynamic from "next/dynamic";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Authenticated, useQuery } from "convex/react";

const WritingApp = dynamic(
    () => import("@/components/writing-app").then((mod) => mod.WritingApp),
    { ssr: false }
);

function ClientContent({ id }: { id: string }) {
    const writing = useQuery(api.writing.get, { id: id as Id<"writings"> });

    return (
        <WritingApp
            document={writing}
            id={id}
        />
    );
}

export function Client({ id }: { id: string }) {
    return (
        <Authenticated>
            <ClientContent id={id} />
        </Authenticated>
    );
}
