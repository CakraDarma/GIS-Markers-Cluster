"use client"

import { MapContainer, TileLayer } from "react-leaflet"

import "leaflet/dist/leaflet.css"
import MarkerMap from "./Marker"

const Map = () => {
  // api web
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerMap />
      {/* <RecenterMap location={[lat, lng]} /> */}
    </MapContainer>
  )
}

export default Map
