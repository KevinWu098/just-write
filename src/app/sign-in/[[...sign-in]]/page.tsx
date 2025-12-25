import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="bg-background flex min-h-dvh items-center justify-center">
            <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                forceRedirectUrl="/"
            />
        </div>
    );
}

