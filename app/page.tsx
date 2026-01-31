"use client"

// This is the main page of our Mood Music Player
// It lets users select a mood and generates AI music for that mood

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Square, Loader2, Music2 } from "lucide-react"

// This defines the different moods available in our app
// Each mood has a name, description, and music style prompt
const moods = [
  {
    name: "Happy",
    description: "Upbeat and cheerful vibes",
    prompt: "Upbeat pop music with cheerful melodies, bright synths, happy drums, and positive energy",
    emoji: "😊",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    name: "Calm",
    description: "Peaceful and relaxing",
    prompt: "Peaceful ambient music with soft piano, gentle pads, calming atmosphere, and slow tempo",
    emoji: "🧘",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    name: "Energetic",
    description: "High energy and motivating",
    prompt: "High energy electronic music with driving beats, powerful bass, energetic synths, and motivating rhythm",
    emoji: "⚡",
    gradient: "from-red-500 to-pink-600",
  },
  {
    name: "Sad",
    description: "Emotional and melancholic",
    prompt: "Melancholic piano music with emotional strings, soft atmospheric pads, slow tempo, and reflective mood",
    emoji: "😢",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    name: "Focus",
    description: "Concentration enhancing",
    prompt: "Lo-fi study music with chill beats, soft piano loops, vinyl crackle, and focused atmosphere",
    emoji: "🎯",
    gradient: "from-green-500 to-teal-600",
  },
  {
    name: "Romantic",
    description: "Love and tenderness",
    prompt: "Romantic jazz music with smooth saxophone, gentle piano, soft drums, and intimate atmosphere",
    emoji: "❤️",
    gradient: "from-rose-500 to-pink-500",
  },
]

export default function MoodMusicPlayer() {
  // State variables to track the app's current status
  const [selectedMood, setSelectedMood] = useState<string | null>(null) // Which mood is selected
  const [isGenerating, setIsGenerating] = useState(false) // Are we generating music?
  const [isPlaying, setIsPlaying] = useState(false) // Is music playing?
  const [audioUrl, setAudioUrl] = useState<string | null>(null) // URL of generated music
  const [error, setError] = useState<string | null>(null) // Any error messages
  const [currentTime, setCurrentTime] = useState(0) // Current playback time
  const [duration, setDuration] = useState(0) // Total music duration

  // useRef creates a reference to the audio element so we can control it
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // This function runs when a user clicks on a mood card
  const handleMoodSelect = async (mood: (typeof moods)[0]) => {
    setSelectedMood(mood.name)
    setError(null)
    setIsGenerating(true)
    setAudioUrl(null)
    setIsPlaying(false)

    try {
      // Call our API to generate music based on the selected mood
      const response = await fetch("/api/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: mood.prompt,
          mood: mood.name,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate music")
      }

      // Get the audio data from the response
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setAudioUrl(url)
      setIsGenerating(false)

      // Automatically play the music once it's generated
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
          setIsPlaying(true)
        }
      }, 100)
    } catch (err) {
      setError("Failed to generate music. Please try again.")
      setIsGenerating(false)
      console.error("Error generating music:", err)
    }
  }

  // Play/Pause button handler
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Stop button - pauses music and resets to beginning
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  // Replay button - restarts the music from beginning
  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Update current time as music plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Set duration when music loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Format time from seconds to MM:SS format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Clean up the audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-10 h-10 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">Mood Music</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your mood and let AI create the perfect soundtrack for your moment
          </p>
        </div>

        {/* Mood Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {moods.map((mood) => (
            <Card
              key={mood.name}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                selectedMood === mood.name
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleMoodSelect(mood)}
            >
              <div className="flex items-start gap-4">
                <div className={`text-5xl bg-gradient-to-br ${mood.gradient} p-3 rounded-xl`}>{mood.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{mood.name}</h3>
                  <p className="text-muted-foreground">{mood.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Music Player Section */}
        {(isGenerating || audioUrl || error) && (
          <Card className="max-w-2xl mx-auto p-8 border-2 border-primary/30 shadow-xl">
            <div className="text-center">
              {/* Loading State */}
              {isGenerating && (
                <div className="space-y-4">
                  <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                  <p className="text-xl font-medium">Creating your {selectedMood} music...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="space-y-4">
                  <div className="text-destructive text-lg">{error}</div>
                  <Button onClick={() => setError(null)} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}

              {/* Audio Player Controls */}
              {audioUrl && !isGenerating && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Now Playing</h2>
                    <p className="text-xl text-primary">{selectedMood} Music</p>
                  </div>

                  {/* Audio Element (hidden but functional) */}
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleReplay}
                      className="rounded-full w-14 h-14 bg-transparent"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>

                    <Button
                      size="lg"
                      onClick={togglePlayPause}
                      className="rounded-full w-20 h-20 bg-primary hover:bg-primary/90"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleStop}
                      className="rounded-full w-14 h-14 bg-transparent"
                    >
                      <Square className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
