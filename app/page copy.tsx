"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { LatLngExpression } from "leaflet"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import RecenterMap from "@/components/RecenterMap"
import { myIcon } from "@/utils/Icon"

export default function IndexPage() {
  // api web
  const [geolocation, setGeolocation] = useState<LatLngExpression | null>(null)
  const markerRef = useRef<any>(null)

  const eventHandler = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current

        if (marker) {
          const position = marker.getLatLng()
          setGeolocation(position)
        }
      },
    }),
    []
  )

  useEffect(() => {
    setGeolocation({
      lat: -8.639152628370512,
      lng: 115.19347429275514,
    })
  }, [])

  // useEffect(() => {
  // 	if ('geolocation' in navigator) {
  // 		navigator.geolocation.getCurrentPosition(function (position) {
  // 			setGeolocation({
  // 				lat: position.coords.latitude,
  // 				lng: position.coords.longitude,
  // 			});
  // 		});
  // 	} else {
  // 		console.log('Your device is not available geolocation');
  // 	}
  // }, []);

  if (!geolocation) {
    return (
      <div>
        <h1>Upp Something Wrong...</h1>
      </div>
    )
  }
  return (
    <MapContainer
      center={geolocation}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        icon={myIcon}
        ref={markerRef}
        position={geolocation}
        draggable={true}
        eventHandlers={eventHandler}
      >
        <Popup>Cakra Home.</Popup>
      </Marker>

      <RecenterMap location={geolocation} />
    </MapContainer>
  )
}
