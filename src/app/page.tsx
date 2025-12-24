import { PolyfillWrapper } from "@/components/polyfill-wrapper";
import { WritingApp } from "@/components/writing-app";

export default function Home() {
    return (
        <PolyfillWrapper>
            <WritingApp />
        </PolyfillWrapper>
    );
}
