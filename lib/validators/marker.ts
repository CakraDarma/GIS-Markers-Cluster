import { z } from "zod"

export const MarkerValidator = z.object({
  lat: z.number(),
  lng: z.number(),
  kecamatan: z.string(),
  kabupaten: z.string(),
  provinsi: z.string(),
})
