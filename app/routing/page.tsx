"use client"

import dynamic from "next/dynamic"
import L from "leaflet"

const DynamicMap = dynamic(() => import("../../components/MapRouting"), {
  ssr: false,
})
export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Leaflet Routing Machine
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Leaflet Routing Machine is a JavaScript library that provides a simple
          way to add routing and navigation functionality to web maps
        </p>
      </div>
      <div className="flex gap-4">
        <DynamicMap />
      </div>
    </section>
  )
}

let DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
})
L.Marker.prototype.options.icon = DefaultIcon
