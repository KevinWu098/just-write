"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";

const WritingApp = dynamic(
    () => import("@/components/writing-app").then((mod) => mod.WritingApp),
    { ssr: false }
);

export function Client({ id }: { id: string }) {
    const { user, isLoaded } = useUser();
    const writing = useQuery(api.writing.get, { id: id as Id<"writings"> });

    if (!isLoaded || writing === undefined) {
        return null;
    }

    if (writing === null) {
        return (
            <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-12">
                <div className="space-y-4 text-center">
                    <h1 className="text-foreground text-2xl font-medium">
                        Writing not available
                    </h1>
                    <p className="text-muted-foreground">
                        This writing is either private or does not exist.{" "}
                        <Link
                            href="/"
                            className="text-foreground hover:underline"
                        >
                            Want to write?
                        </Link>{" "}
                        <Link
                            href={`/sign-in?redirect_url=${encodeURIComponent(`/writings/${id}`)}`}
                            className="text-foreground hover:underline"
                        >
                            Or sign in?
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    // Check if user is the author
    const isAuthor = user?.id && writing.createdBy === user.id;
    const isAuthenticated = !!user;

    return (
        <WritingApp
            document={writing}
            id={id}
            readOnly={!isAuthor}
            isAuthenticated={isAuthenticated}
        />
    );
}
