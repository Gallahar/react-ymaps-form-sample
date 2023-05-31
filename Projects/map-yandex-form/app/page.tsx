'use client'
import type ymaps from 'yandex-maps'
import Image from 'next/image'
import saleImg from '@/public/images/saleImg.jpg'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Map, Placemark } from '@pbe/react-yandex-maps'
import { useRef, useState, FormEvent } from 'react'

type TLatLong = [number, number]

export default function Home() {
	const { coordinates, error } = useGeolocation()
	const [currentLocation, setCurrentLocation] = useState('')
	const [coords, setCoords] = useState<TLatLong | null>(null)
	const [address, setAddress] = useState('')
	const mapRef = useRef<ymaps.Map>()
	const yMaps = useRef<typeof ymaps | null>(null)
	const titleRef = useRef<HTMLInputElement | null>(null)
	const priceRef = useRef<HTMLInputElement | null>(null)

	const onLoadMap = (mapInstance: typeof ymaps) => {
		yMaps.current = mapInstance

		if (mapRef.current) {
			mapRef.current.events.add('click', handleMapClick)
		}
	}

	const onClickForm = async () => {
		if (coords) {
			let result = await yMaps.current?.geocode(coords)
			let address = result?.geoObjects.get(0).properties?.get('name', {})
			if (typeof address === 'string') {
				setAddress(address)
			}
		}
	}

	const receiveLocation = async () => {
		try {
			let result = await yMaps.current?.geocode(
				[coordinates.lat, coordinates.lng],
				{ kind: 'locality' }
			)
			let address = result?.geoObjects.get(0).properties?.get('name', {})
			if (typeof address === 'string') {
				setCurrentLocation(address)
			}
		} catch (e) {
			setCurrentLocation('')
		}
	}

	const handleMapClick = (e: ymaps.IEvent<MouseEvent, {}>) => {
		const coords = e.get('coords')
		setCoords(coords)
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const data = {
			title: titleRef?.current?.value,
			address: address,
			location: coords?.join(','),
			clickPrice: priceRef?.current?.value,
		}
		if (!address) return
		alert(JSON.stringify(data))
	}

	return (
		<main className="grid grid-cols-2 gap-10">
			<div className="col-span-2">
				{!currentLocation && !error ? (
					<button
						onClick={receiveLocation}
						className="p-5 rounded-sm bg-slate-400 shadow-lg"
					>
						узнать ваше местоположение?
					</button>
				) : (
					<p className="p-5 rounded-sm bg-slate-400 max-w-sm">
						{currentLocation
							? `Ваше текущее местоположение : ${currentLocation}`
							: error}
					</p>
				)}
			</div>
			<h2>Добавить акцию</h2>
			<h2>Выберите местоположение</h2>
			<form
				onSubmit={handleSubmit}
				className="bg-slate-400 rounded-sm grid grid-cols-1 gap-5 p-10"
			>
				<Image width={100} height={100} src={saleImg} alt="sale" />
				<p>Заполните все поля</p>
				<label className="text-white">
					Заголовок
					<input
						ref={titleRef}
						required
						className="block px-3 py-0.5 text-black bg-gray-300"
					/>
				</label>
				<label className="text-white">
					Адрес
					<input
						onClick={onClickForm}
						type="text"
						readOnly
						value={address}
						required
						className="block px-3 py-0.5  text-black bg-gray-300"
					/>
				</label>
				<label className="text-white relative">
					Цена за клик (руб.)
					<input
						ref={priceRef}
						type="number"
						min="0.00"
						max="10000.00"
						step="0.01"
						required
						className="block px-3 py-0.5 text-black bg-gray-300"
					/>
				</label>
				<button
					type="submit"
					className="p-4 bg-green-500 rounded-xl justify-self-end"
				>
					Добавить
				</button>
			</form>
			<Map 
				instanceRef={mapRef}
				onLoad={onLoadMap}
				width={'100%'}
				height={'100%'}
				defaultState={{ center: [55.751574, 37.573856], zoom: 9 }}
			>
				{coords && <Placemark geometry={coords} />}
			</Map>
		</main>
	)
}
