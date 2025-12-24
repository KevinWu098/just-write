import { WritingsList } from "./writings-list";

export default function WritingsPage() {
    return (
        <main className="bg-background flex min-h-dvh flex-col items-center px-4 py-12">
            <div className="w-full max-w-4xl space-y-6">
                <div className="space-y-2">
                    <h1 className="text-foreground font-serif text-4xl font-medium">
                        Your Writings
                    </h1>
                </div>

                <WritingsList />
            </div>
        </main>
    );
}
