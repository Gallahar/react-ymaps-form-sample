import { useYMaps } from "@pbe/react-yandex-maps"
import { useEffect, useRef } from "react"

export const Map = () => {
	const mapRef = useRef(null)
	const ymaps = useYMaps(['Map'])

	useEffect(() => {
		if (!ymaps || !mapRef.current) {
			return
		}

		new ymaps.Map(mapRef.current, {
			center: [55.76, 37.64],
			zoom: 10,
		})
	}, [ymaps])

	return <div ref={mapRef} style={{ width: '320px', height: '240px' }} />
}
