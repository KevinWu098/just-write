import { TimerSelect } from "@/components/timer-select";

export default function Page() {
    return (
        <main className="bg-background flex min-h-dvh flex-col items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-foreground font-serif text-5xl font-medium">
                        Just Write
                    </h1>
                </div>

                <TimerSelect />
            </div>
        </main>
    );
}
