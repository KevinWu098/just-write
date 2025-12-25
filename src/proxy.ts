import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/writings/(.+)"]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        const { redirectToSignIn, userId } = await auth();

        if (userId) {
            return NextResponse.next();
        }

        return redirectToSignIn({ returnBackUrl: req.url });
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
