"use client";

import type * as React from "react";
import { useEffect } from "react";

import { initializeDB } from "@/db";
import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/tanstack-query/get-query-client";

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    useEffect(() => {
        void initializeDB();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
