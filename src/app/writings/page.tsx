import Link from "next/link";

import { WritingsList } from "./writings-list";

export default function WritingsPage() {
    return (
        <main className="bg-background flex min-h-dvh flex-col items-center px-4 py-12">
            <div className="w-full max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-foreground font-serif text-4xl font-medium">
                        Your Writings
                    </h1>
                    <Link
                        href="/"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Start New Writing
                    </Link>
                </div>

                <WritingsList />
            </div>
        </main>
    );
}
