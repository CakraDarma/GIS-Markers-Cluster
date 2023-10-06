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
