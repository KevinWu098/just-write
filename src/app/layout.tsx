import type React from "react";
import type { Metadata, Viewport } from "next";
import {
    Instrument_Sans,
    Instrument_Serif,
    JetBrains_Mono,
} from "next/font/google";

import "./globals.css";
import "core-js/actual/iterator";

import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/app/convex-client-provider";

const _instrumentSans = Instrument_Sans({ subsets: ["latin"] });
const _instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
});
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Just Write",
    generator: "v0.app",
    icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✏️</text></svg>",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#f5f3ef",
    interactiveWidget: "resizes-content",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`root font-sans antialiased`}>
                <ClerkProvider>
                    <ConvexClientProvider>
                        <NuqsAdapter>
                            <div className="bg-background flex flex-1 flex-col">
                                {children}
                            </div>
                            <Toaster position="bottom-center" />
                        </NuqsAdapter>
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
