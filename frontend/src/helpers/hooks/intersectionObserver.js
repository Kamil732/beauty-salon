import { useEffect, useState } from 'react'

const useIntersectionObserver = (reference) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const handleIntersect = (entries, observer) => {
			if (entries[0].isIntersecting) {
				setIsVisible(true)
				observer.unobserve(entries[0].target)
				observer.disconnect()
			}
		}

		// Create the observer, passing in the callback
		const observer = new IntersectionObserver(handleIntersect)

		// If we have a ref value, start observing it
		if (reference) {
			observer.observe(reference.current)
		}

		// If unmounting, disconnect the observer
		return () => observer.disconnect()
	}, [reference])

	return isVisible
}

export default useIntersectionObserver
