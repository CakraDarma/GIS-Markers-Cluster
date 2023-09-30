"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { LatLngExpression } from "leaflet"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"
import RecenterMap from "@/components/RecenterMap"
import { myIcon } from "@/utils/Icon"

const Map = () => {
  // api web
  const [geolocation, setGeolocation] = useState<any>([])
  // const [geolocation, setGeolocation] = useState<LatLngExpression | null>(null)
  const markerRef = useRef<any>(null)

  function MultipleMarkers() {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng
        const response = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        )

        if (response.data.locality) {
          const kecamatan = response.data.locality
          const kabupaten = response.data.city
          const provinsi = response.data.principalSubdivision
          const locationData = {
            lat,
            lng,
            kecamatan,
            kabupaten,
            provinsi,
          }
          setGeolocation((prevState: any) => [...prevState, locationData])
        }
      },
    })
    return geolocation.map((coordinata: any, index: number) => {
      return (
        <Marker
          key={index}
          icon={myIcon}
          // ref={markerRef}
          position={coordinata}
          draggable={true}
          eventHandlers={eventHandler}
        >
          <Popup>
            <h1>{`Provinsi: ${coordinata.provinsi}`}</h1>
            <h1>{`Provinsi: ${coordinata.kabupaten}`}</h1>
            <h1>{`Provinsi: ${coordinata.kecamatan}`}</h1>
          </Popup>
        </Marker>
      )
    })
  }

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
  return (
    <MapContainer
      center={[-8.6828693, 115.2004822]}
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
      <MultipleMarkers />
      <RecenterMap location={[-8.6828693, 115.2004822]} />
    </MapContainer>
  )
}

export default Map
