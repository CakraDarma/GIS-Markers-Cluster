"use client"

import React, { useState } from "react"
import axios from "axios"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import { MarkerMuster } from "react-leaflet-muster"

import "leaflet/dist/leaflet.css"
import { myIcon } from "@/utils/Icon"

const MarkerMap = () => {
  const [geolocation, setGeolocation] = useState<any>([])

  const deleteMarkerPosition = (index: any, e: any) => {
    const updatedLocationData = [...geolocation]
    updatedLocationData.splice(index, 1)
    setGeolocation(updatedLocationData)
    // makeapi()
  }

  const updateMarkerPosition = async (index: any, newPosition: any) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${newPosition.lat}&longitude=${newPosition.lng}&localityLanguage=en`
      )

      if (response.data.locality) {
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
        }
        setGeolocation(updatedLocationData)
      }
    } catch (error) {
      console.error("Error fetching location data", error)
    }
  }

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
        const payload: any = {
          lat,
          lng,
          kecamatan,
          kabupaten,
          provinsi,
        }
        await axios.post("/api/marker", payload)
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
              contextmenu: (e) => deleteMarkerPosition(index, e),
            }}
          >
            <Popup>
              <h1>{`${coordinata.provinsi}`}</h1>
              <h1>{` ${coordinata.kabupaten}`}</h1>
              <h1>{` ${coordinata.kecamatan}`}</h1>
            </Popup>
          </Marker>
        )
      })}
    </MarkerMuster>
  )
}

export default MarkerMap
