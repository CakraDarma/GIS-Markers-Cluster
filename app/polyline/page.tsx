"use client"

import dynamic from "next/dynamic"

const DynamicMap = dynamic(() => import("../../components/MapPolyline"), {
  ssr: false,
})
export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Polyline Markers
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Leaflet: Draw shapes polyline in react leaflet.
        </p>
      </div>
      <div className="flex gap-4">
        <DynamicMap />
      </div>
    </section>
  )
}
