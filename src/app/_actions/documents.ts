"use client";

import { initializeDB } from "@/db";
import { eq } from "drizzle-orm";

import { document, type Document } from "@/db/schema";

export async function createDocument(
    timerDuration: number | null = 5
): Promise<string> {
    const db = await initializeDB();

    const [newDocument] = await db
        .insert(document)
        .values({
            body: { type: "doc", content: [] }, // Empty TipTap document
            createdBy: "anonymous", // TODO: Add auth later
            timerDuration,
        })
        .returning();

    if (!newDocument) {
        throw new Error("Failed to create document");
    }

    return newDocument.id;
}

export async function getDocument(id: string): Promise<Document | undefined> {
    const db = await initializeDB();

    const [doc] = await db
        .select()
        .from(document)
        .where(eq(document.id, id))
        .limit(1);

    return doc;
}

export async function updateDocument(
    id: string,
    body: unknown,
    timerDuration: number | null
): Promise<void> {
    const db = await initializeDB();

    await db
        .update(document)
        .set({
            body,
            timerDuration,
            updatedAt: new Date(),
        })
        .where(eq(document.id, id));
}
