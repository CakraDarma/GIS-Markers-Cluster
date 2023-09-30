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
import { MarkerMuster } from "react-leaflet-muster"

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
    return (
      <MarkerMuster>
        {geolocation.map((coordinata: any, index: number) => {
          return (
            <Marker
              key={index}
              icon={myIcon}
              // ref={markerRef}
              position={coordinata}
              // draggable={true}
              // eventHandlers={eventHandler}
            >
              <Popup>
                <h1>{`Provinsi: ${coordinata.provinsi}`}</h1>
                <h1>{`Kabupaten: ${coordinata.kabupaten}`}</h1>
                <h1>{`Kecamatan: ${coordinata.kecamatan}`}</h1>
              </Popup>
            </Marker>
          )
        })}
      </MarkerMuster>
    )
  }

  // const eventHandler = useMemo(
  //   () => ({
  //     dragend() {
  //       const marker = markerRef.current

  //       if (marker) {
  //         console.log(marker)
  //         // const position = marker.getLatLng()
  //         // setGeolocation(position)
  //       }
  //     },
  //   }),
  //   []
  // )

  type lastLocationData = {
    lat: number
    lng: number
    kecamatan: string
    kabupaten: string
    provinsi: string
  }
  let lastLocation: lastLocationData = geolocation[geolocation.length - 1]
  let lat: number
  let lng: number
  if (lastLocation) {
    lat = lastLocation.lat
    lng = lastLocation.lng
  } else {
    lat = -8.6828693
    lng = 115.2004822
  }

  console.log(geolocation)

  return (
    <MapContainer
      center={[-8.6828693, 115.2004822]}
      zoom={13}
      ref={markerRef}
      scrollWheelZoom={true}
      style={{
        height: "70vh",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MultipleMarkers />
      <RecenterMap location={[lat, lng]} />
    </MapContainer>
  )
}

export default Map
