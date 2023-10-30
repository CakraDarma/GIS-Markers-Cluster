"use client"

import { FeatureGroup, MapContainer, Polyline, TileLayer } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"

import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { useState } from "react"

const Map = () => {
  const [mapLayers, setMapLayers] = useState([])
  const [loading, setLoading] = useState(false)

  // const fetchData = useCallback(async () => {
  //   setLoading(true)
  //   try {
  //     setLoading(true)
  //     const response = await axios.get("/api/polyline")
  //     const data = response.data
  //     setMapLayers(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   setLoading(false)
  // }, [])

  // useEffect(() => {
  //   fetchData()
  // }, [fetchData])

  const pos = [
    {
      id: 119,
      latlngs: [
        { lat: -8.663148039351935, lng: 115.19579627713699 },
        { lat: -8.664676339550152, lng: 115.21125434563159 },
        { lat: -8.688109497371881, lng: 115.21984216146194 },
      ],
    },
    {
      id: 119,
      latlngs: [
        { lat: -8.686581292545357, lng: 115.17570078809398 },
        { lat: -8.701693266402467, lng: 115.20627341244999 },
      ],
    },
  ]
  console.log(mapLayers)

  const _onCreated = (e) => {
    const { layerType, layer } = e
    if (layerType === "polyline") {
      const { _leaflet_id } = layer

      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer._latlngs },
      ])
    }
  }

  const _onEdited = (e) => {
    const {
      layers: { _layers },
    } = e

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id ? { ...l, latlngs: [...editing.latlngs[0]] } : l
        )
      )
    })
  }

  const _onDeleted = (e) => {
    const {
      layers: { _layers },
    } = e

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id))
    })
  }

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
      <FeatureGroup>
        <EditControl
          // onDrawStart={_onDrawStart}
          position="topright"
          onCreated={_onCreated}
          onEdited={_onEdited}
          onDeleted={_onDeleted}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polygon: false,
          }}
        />
        {pos.map((coordinata, index) => {
          return <Polyline positions={coordinata.latlngs} key={index} />
        })}
      </FeatureGroup>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default Map
