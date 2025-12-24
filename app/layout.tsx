import type React from "react"
import type { Metadata, Viewport } from "next"
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "core-js/actual/iterator"

const _instrumentSans = Instrument_Sans({ subsets: ["latin"] })
const _instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
})
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Just Write",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f5f3ef",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Polyfill for Iterator.prototype.toArray()
              if (typeof Iterator !== 'undefined' && !Iterator.prototype.toArray) {
                Iterator.prototype.toArray = function() {
                  return Array.from(this);
                };
              }
              
              // Polyfill for Map.prototype.values().toArray()
              if (typeof Map !== 'undefined') {
                const originalValues = Map.prototype.values;
                Map.prototype.values = function() {
                  const iterator = originalValues.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
                
                const originalKeys = Map.prototype.keys;
                Map.prototype.keys = function() {
                  const iterator = originalKeys.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
                
                const originalEntries = Map.prototype.entries;
                Map.prototype.entries = function() {
                  const iterator = originalEntries.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
              }
              
              // Polyfill for Set.prototype.values().toArray()
              if (typeof Set !== 'undefined') {
                const originalSetValues = Set.prototype.values;
                Set.prototype.values = function() {
                  const iterator = originalSetValues.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
                
                const originalSetKeys = Set.prototype.keys;
                Set.prototype.keys = function() {
                  const iterator = originalSetKeys.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
                
                const originalSetEntries = Set.prototype.entries;
                Set.prototype.entries = function() {
                  const iterator = originalSetEntries.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
