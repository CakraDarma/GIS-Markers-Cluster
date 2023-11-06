"use client"

import axios from "axios"
import { FeatureGroup, MapContainer, Polyline, TileLayer } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"

import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import polyline from "polyline-encoded"

const Map = () => {
  const [encodedPolylines, setEncodedPolylines] = useState([])
  const featureGroupRef = useRef()

  async function fetchData() {
    try {
      const response = await axios.get("/api/polyline")
      setEncodedPolylines(response.data)
    } catch (error) {
      console.error("Terjadi kesalahan dalam pengambilan data:", error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers()
      encodedPolylines?.map((data) => {
        const decodedCoords = polyline.decode(data.position)
        const id = data.id
        const polylineLayer = L.polyline(decodedCoords, {
          id,
        })
        featureGroupRef.current.addLayer(polylineLayer)
      })
    }
  }, [encodedPolylines])

  const onCreated = async (e) => {
    const { layer } = e

    const coordinates = layer.getLatLngs().map((latLng) => ({
      lat: latLng.lat,
      lng: latLng.lng,
    }))
    const encodedPolyline = await polyline.encode(
      coordinates.map((coord) => [coord.lat, coord.lng])
    )
    const polylines = {
      position: encodedPolyline,
    }
    const response = await axios.post("/api/polyline", polylines)
    setEncodedPolylines((layers) => [...layers, response.data])
  }

  const onEdited = async (e) => {
    const {
      layers: { _layers },
    } = e

    let id
    let encodedPolyline
    Object.values(_layers).map(({ options, editing }) => {
      const coordinates = editing.latlngs[0].map((latLng) => ({
        lat: latLng.lat,
        lng: latLng.lng,
      }))
      id = options.id
      encodedPolyline = polyline.encode(
        coordinates.map((coord) => [coord.lat, coord.lng])
      )
    })
    await axios.patch("/api/polyline", { id, encodedPolyline })
    fetchData()
  }

  const onDeleted = async (e) => {
    const {
      layers: { _layers },
    } = e
    let id

    Object.values(_layers).map(({ options }) => {
      id = options.id
    })
    await axios.delete("/api/polyline", { data: { id } })
    fetchData()
  }

  return (
    <MapContainer
      center={[-8.6828693, 115.2004822]}
      zoom={13}
      scrollWheelZoom={true}
      style={{
        height: "70vh",
        width: "100%",
      }}
    >
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          onCreated={onCreated}
          onEdited={onEdited}
          onDeleted={onDeleted}
          position="topright"
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: true,
            polygon: false,
          }}
        />
      </FeatureGroup>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default Map
