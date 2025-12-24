import { WritingApp } from "@/components/writing-app"
import { PolyfillWrapper } from "@/components/polyfill-wrapper"

export default function Home() {
  return (
    <PolyfillWrapper>
      <WritingApp />
    </PolyfillWrapper>
  )
}
