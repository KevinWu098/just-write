"use client";

import type React from "react";
import { useEffect, useState } from "react";

// Comprehensive polyfill that runs immediately
if (typeof window !== "undefined") {
    // Polyfill Iterator.prototype.toArray if it doesn't exist
    if (typeof Iterator !== "undefined" && !Iterator.prototype.toArray) {
        Iterator.prototype.toArray = function () {
            const result = [];
            for (const item of this) {
                result.push(item);
            }
            return result;
        };
    }

    // Polyfill for Map and Set iterators
    const originalMapValues = Map.prototype.values;
    const originalMapKeys = Map.prototype.keys;
    const originalMapEntries = Map.prototype.entries;
    const originalSetValues = Set.prototype.values;
    const originalSetKeys = Set.prototype.keys;
    const originalSetEntries = Set.prototype.entries;

    function addToArray<T>(
        iterator: IterableIterator<T>
    ): IterableIterator<T> & { toArray: () => T[] } {
        return Object.assign(iterator, {
            toArray() {
                const result: T[] = [];
                for (const item of iterator) {
                    result.push(item);
                }
                return result;
            },
        });
    }

    Map.prototype.values = function () {
        return addToArray(originalMapValues.call(this));
    };

    Map.prototype.keys = function () {
        return addToArray(originalMapKeys.call(this));
    };

    Map.prototype.entries = function () {
        return addToArray(originalMapEntries.call(this));
    };

    Set.prototype.values = function () {
        return addToArray(originalSetValues.call(this));
    };

    Set.prototype.keys = function () {
        return addToArray(originalSetKeys.call(this));
    };

    Set.prototype.entries = function () {
        return addToArray(originalSetEntries.call(this));
    };
}

export function PolyfillWrapper({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Ensure polyfill is applied before rendering children
        setIsReady(true);
    }, []);

    if (!isReady) {
        return null;
    }

    return <>{children}</>;
}
