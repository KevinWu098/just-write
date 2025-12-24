"use client";

import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { getDocumentOptions } from "@/_queries/get-document/get-document";

import { WritingApp } from "@/components/writing-app";

export function Client({ id }: { id: string }) {
    const router = useRouter();
    const { data: document, isPending } = useQuery(getDocumentOptions(id));

    if (!document && !isPending) {
        router.push("/");
        return null;
    }

    if (isPending) {
        return null;
    }

    return <WritingApp document={document} />;
}
