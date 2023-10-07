import { z } from "zod"

import { db } from "@/lib/db"
import { MarkerValidator } from "@/lib/validators/marker"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { lat, lng, kecamatan, kabupaten, provinsi } =
      MarkerValidator.parse(body)

    // create subreddit and associate it with the user
    const marker = await db.marker.create({
      data: {
        lat,
        lng,
        kecamatan,
        kabupaten,
        provinsi,
      },
    })

    return new Response(JSON.stringify(marker.kecamatan))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response("Could not create marker", { status: 500 })
  }
}

export async function GET(req: Request, res: Response) {
  const url = new URL(req.url)
  const q = url.searchParams.get("q")
  console.log(q)

  if (!q) return new Response("Invalid query", { status: 400 })

  // const results = await db.subreddit.findMany({
  //   where: {
  //     name: {
  //       startsWith: q,
  //     },
  //   },
  //   include: {
  //     _count: true,
  //   },
  //   take: 5,
  // })

  // return new Response(JSON.stringify(results))
}
