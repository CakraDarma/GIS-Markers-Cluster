import { z } from "zod"

import { db } from "@/lib/db"
import { MarkerValidator } from "@/lib/validators/marker"

export async function POST(req: Request) {
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

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response("Could not create marker", { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await db.marker.findMany()

    return new Response(JSON.stringify(results))
  } catch (error) {
    return new Response("Could not get marker", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { lat, lng, kecamatan, kabupaten, provinsi, id } =
      MarkerValidator.parse(body)

    // update username
    await db.marker.update({
      where: {
        id,
      },
      data: {
        lat,
        lng,
        kecamatan,
        kabupaten,
        provinsi,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }
    return new Response(
      "Could not update marker at this time. Please try later",
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    const existingMarker = await db.marker.findFirst({
      where: {
        id,
      },
    })

    if (existingMarker) {
      await db.marker.delete({
        where: {
          id,
        },
      })
    } else {
      return new Response("Can't find ID Marker", { status: 400 })
    }

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      "Could not delete marker at this time. Please try later",
      { status: 500 }
    )
  }
}
