// This is the API route that handles music generation
// It receives a mood and prompt, then calls the AI music API

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the mood and prompt from the request body
    const { prompt, mood } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Call the ElevenLabs Music Generation API
    // Using the custom endpoint that's provided for this app
    const response = await fetch("https://elevenlabs-proxy-server-lipn.onrender.com/v1/music", {
      method: "POST",
      headers: {
        customerId: "null",
        "Content-Type": "application/json",
        Authorization: "Bearer xxx",
      },
      body: JSON.stringify({
        prompt: prompt,
        music_length_ms: 60000, // 60 seconds of music
        model_id: "music_v1",
      }),
    })

    if (!response.ok) {
      throw new Error(`Music generation failed: ${response.statusText}`)
    }

    // Get the audio data and send it back to the client
    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error("Error generating music:", error)
    return NextResponse.json({ error: "Failed to generate music" }, { status: 500 })
  }
}
