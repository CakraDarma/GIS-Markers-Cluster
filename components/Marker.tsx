"use client"

import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import { MarkerMuster } from "react-leaflet-muster"

import "leaflet/dist/leaflet.css"
import { myIcon } from "@/utils/Icon"

interface Marker {
  id: string
  lat: number
  lng: number
  kecamatan: string
  kabupaten: string
  provinsi: string
}

const MarkerMap = () => {
  const [geolocation, setGeolocation] = useState<Marker[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      setLoading(true)
      const response = await axios.get("/api/marker")
      const data = response.data
      setGeolocation(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const deleteMarkerPosition = async (index: number) => {
    const updatedLocationData = [...geolocation]
    const id = updatedLocationData[index].id
    await axios.delete("/api/marker", { data: { id } })
    updatedLocationData.splice(index, 1)
    setGeolocation(updatedLocationData)
  }

  const updateMarkerPosition = async (
    index: number,
    newPosition: { lat: string; lng: string }
  ) => {
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
          lat: parseFloat(newPosition.lat),
          lng: parseFloat(newPosition.lng),
          kecamatan,
          kabupaten,
          provinsi,
        }
        setGeolocation(updatedLocationData)

        await axios.patch("/api/marker", updatedLocationData[index])
      }
    } catch (error) {
      console.error("Error fetching location data", error)
    }
  }

  // tidak punya id

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
        await axios.post("/api/marker", locationData)
        fetchData()
      }
    },
  })

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <MarkerMuster>
          {geolocation.map((coordinata: Marker, index: number) => {
            return (
              <Marker
                key={index}
                icon={myIcon}
                position={coordinata}
                draggable={true}
                eventHandlers={{
                  dragend: (e) =>
                    updateMarkerPosition(index, e.target.getLatLng()),
                  contextmenu: (e) => deleteMarkerPosition(index),
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
      )}
    </div>
  )
}

export default MarkerMap
