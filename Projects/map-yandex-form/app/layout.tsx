'use client'

import '@/assets/styles/globals.scss'
import { YMaps } from '@pbe/react-yandex-maps'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<YMaps
					query={{
						load: 'Map,GeoObject,geocode',
						apikey: process.env.NEXT_PUBLIC_MAP_API_KEY,
					}}
				>
					<div className="p-10 min-h-screen max-w-screen-2xl bg-white m-auto">
						{children}
					</div>
				</YMaps>
			</body>
		</html>
	)
}
