import { useState, useEffect } from 'react'

export const useGeolocation = () => {
	const [location, setLocation] = useState({
		loaded: false,
		coordinates: { lat: 0, lng: 0 },
		error: '',
	})

	const onSuccess = (location: GeolocationPosition) => {
		setLocation((loc) => ({
			...loc,
			loaded: true,
			coordinates: {
				lat: location.coords.latitude,
				lng: location.coords.longitude,
			},
		}))
	}

	const onError = (error: GeolocationPositionError) => {
		setLocation((loc) => ({
			...loc,
			loaded: true,
			error: error.message,
		}))
	}

	useEffect(() => {
		if (!('geolocation' in navigator)) {
			setLocation((state) => ({
				...state,
				loaded: true,
				error: 'Geolocation is not supported',
			}))
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onError)
	}, [])

	return location
}
