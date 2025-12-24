"use client";

import { useQuery } from "convex/react";

import { WritingApp } from "@/components/writing-app";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export function Client({ id }: { id: string }) {
    const writing = useQuery(api.writing.get, { id: id as Id<"writings"> });

    return <WritingApp document={writing} id={id} />;
}
