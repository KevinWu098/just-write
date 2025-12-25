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

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
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
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#f5f3ef",
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
                        <div className="bg-background flex flex-1 flex-col">
                            {children}
                        </div>
                        <Toaster position="bottom-center" />
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
