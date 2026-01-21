import gsap from "gsap"
import { RefObject, useMemo } from "react"

const useGsapContext = (scope:RefObject<HTMLElement>) => {
	const ctx = useMemo(() => gsap.context(() => {}, scope), [scope])
	return ctx
}

export default useGsapContext













