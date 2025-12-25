import Link from "next/link";

import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";

import { WritingsList } from "./writings-list";

export default async function Page() {
    const user = await currentUser();

    const displayName =
        user?.firstName || user?.emailAddresses[0]?.emailAddress || "User";

    return (
        <div className="bg-background flex min-h-dvh flex-col items-center px-4 py-12">
            <div className="w-full max-w-4xl space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-foreground font-serif text-4xl font-medium">
                            Your Writings
                        </h1>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                            >
                                Start New Writing
                            </Link>
                        </div>
                    </div>
                    <div className="border-border bg-card/50 flex items-center justify-between rounded-lg border px-4 py-4">
                        <div className="flex items-center gap-3">
                            <p className="text-foreground text-sm font-medium">
                                {displayName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {user?.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>
                        <SignOutButton>
                            <Button className="text-muted-foreground hover:text-foreground group flex items-center gap-2 rounded-lg text-sm font-medium transition-colors">
                                <p className="group-hover:text-foreground group-hover:underline">
                                    Sign Out
                                </p>
                            </Button>
                        </SignOutButton>
                    </div>
                </div>

                <WritingsList />
            </div>
        </div>
    );
}
