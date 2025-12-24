"use client";

import { WritingApp } from "@/components/writing-app";

export function Client({ id }: { id: string }) {
    // TODO: Implement Convex query to fetch document
    const document = undefined;

    return <WritingApp document={document} />;
}
