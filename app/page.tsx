import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false,
})
export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        {/* <Button>sdafasdf</Button> */}
        {/* <a
          className="text-blue-500 underline"
          href="https://gis-markers-cluster.vercel.app/"
        >
          Link 2: CRUD Using Database
        </a> */}
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Multiple Markers
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Leaflet: clustering multiple markers, added location tracking feature.
        </p>
      </div>
      <div className="flex gap-4">
        <DynamicMap />
      </div>
    </section>
  )
}
