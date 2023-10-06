"use client"

import React, { useState } from "react"
import axios from "axios"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import { MarkerMuster } from "react-leaflet-muster"

import "leaflet/dist/leaflet.css"
import { myIcon } from "@/utils/Icon"

const MarkerMap = () => {
  const handleDeleteMarker = (e: any, index: any) => {
    e.preventDefault() // Mencegah perilaku default klik kanan
    console.log("cakra")
    const updatedLocationData = [...geolocation]
    updatedLocationData.splice(index, 1)
    setGeolocation(updatedLocationData)
  }

  const updateMarkerPosition = async (index: any, newPosition: any) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${newPosition.lat}&longitude=${newPosition.lng}&localityLanguage=en`
      )

      if (response.data.locality) {
        const newLocationName = response.data.locality
        const updatedLocationData = [...geolocation]
        const kecamatan = response.data.locality
        const kabupaten = response.data.city
        const provinsi = response.data.principalSubdivision
        updatedLocationData[index] = {
          ...updatedLocationData[index],
          lat: newPosition.lat,
          lng: newPosition.lng,
          kecamatan,
          kabupaten,
          provinsi,
          locationName: newLocationName,
        }
        setGeolocation(updatedLocationData)
        console.log(geolocation)
      }
    } catch (error) {
      console.error("Error fetching location data", error)
    }
  }
  const [geolocation, setGeolocation] = useState<any>([])
  useMapEvents({
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
            position={coordinata}
            draggable={true}
            eventHandlers={{
              dragend: (e) => updateMarkerPosition(index, e.target.getLatLng()),
            }}
          >
            <Popup>
              <h1>{`Provinsi: ${coordinata.provinsi}`}</h1>
              <h1>{`Kabupaten: ${coordinata.kabupaten}`}</h1>
              <h1>{`Kecamatan: ${coordinata.kecamatan}`}</h1>
              <div
                className="cursor-pointer"
                onContextMenu={(e) => handleDeleteMarker(e, index)}
              >
                Delete
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MarkerMuster>
  )
}

export default MarkerMap
