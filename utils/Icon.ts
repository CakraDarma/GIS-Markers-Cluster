import L from "leaflet"
// import marker from "public/location.svg"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

export const myIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon.src,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
  iconAnchor: [12.5, 41],
  shadowUrl: markerShadow.src,
  shadowSize: [41, 41],
})
