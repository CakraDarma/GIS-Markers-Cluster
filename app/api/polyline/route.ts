import { z } from "zod"

import { db } from "@/lib/db"

// // import { polylineValidator } from "@/lib/validators/polyline"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { position } = body
    const response = await db.polyline.create({
      data: { position },
    })

    return new Response(JSON.stringify(response))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response("Could not create polyline", { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await db.polyline.findMany()

    return new Response(JSON.stringify(results))
  } catch (error) {
    return new Response("Could not get polyline", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, encodedPolyline } = body

    await db.polyline.update({
      where: {
        id,
      },
      data: {
        position: encodedPolyline,
      },
    })

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }
    return new Response(
      "Could not update polyline at this time. Please try later",
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    const existingpolyline = await db.polyline.findFirst({
      where: {
        id,
      },
    })

    if (existingpolyline) {
      await db.polyline.delete({
        where: {
          id,
        },
      })
    } else {
      return new Response("Can't find ID polyline", { status: 400 })
    }

    return new Response("OK")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      "Could not delete polyline at this time. Please try later",
      { status: 500 }
    )
  }
}
