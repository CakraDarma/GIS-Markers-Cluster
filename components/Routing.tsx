"use client"

import React, { useEffect } from "react"
import L from "leaflet"

import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine"
import { useMap } from "react-leaflet"

import "leaflet-control-geocoder/dist/Control.Geocoder.css"
import "leaflet-control-geocoder/dist/Control.Geocoder.js"

const Routing = () => {
  const map = useMap()
  let DefaultIcon = L.icon({
    iconUrl: "/marche.gif",
    iconSize: [40, 40],
  })
  useEffect(() => {
    var marker1 = L.marker([-8.6828693, 115.2004822], {
      icon: DefaultIcon,
    }).addTo(map)
    map.on("click", function (e) {
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
      L.Routing.control({
        waypoints: [
          L.latLng(-8.6828693, 115.2004822),
          L.latLng(e.latlng.lat, e.latlng.lng),
        ],
        // @ts-ignore
        lineOptions: {
          styles: [
            {
              color: "blue",
              weight: 4,
              opacity: 0.7,
            },
          ],
        },
        routeWhileDragging: false,
        // @ts-ignore
        geocoder: L.Control.Geocoder.nominatim(),
        addWaypoints: false,
        draggableWaypoints: true,
        fitSelectedRoutes: false,
        showAlternatives: false,
      })
        .on("routesfound", function (e) {
          e.routes[0].coordinates.forEach(
            (c: { lat: number; lng: number }, i: number) => {
              setTimeout(() => {
                marker1.setLatLng([c.lat, c.lng])
              }, 1000 * i)
            }
          )
        })
        .addTo(map)
    })
  }, [])
  return null
}

export default Routing
