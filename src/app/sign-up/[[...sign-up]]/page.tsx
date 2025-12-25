import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="bg-background flex min-h-dvh items-center justify-center">
            <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                forceRedirectUrl="/"
            />
        </div>
    );
}
