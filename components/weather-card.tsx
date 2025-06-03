"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Wind, Droplets, Eye, Gauge } from "lucide-react"
import type { WeatherData } from "@/app/page"

interface WeatherCardProps {
  weather: WeatherData
  onAddToFavorites: (city: string) => void
  isFavorite: boolean
  isDemo?: boolean
}

export function WeatherCard({ weather, onAddToFavorites, isFavorite, isDemo = false }: WeatherCardProps) {
  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : "/placeholder.svg?height=80&width=80"

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-white text-2xl">
              {weather.city}, {weather.country}
            </CardTitle>
            {isDemo && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
                Demo
              </Badge>
            )}
          </div>
          <Button
            onClick={() => onAddToFavorites(weather.city)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            disabled={isFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Temperature Display */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <img
                src={iconUrl || "/placeholder.svg"}
                alt={weather.description}
                className="w-20 h-20"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                }}
              />
            </div>
            <div className="text-6xl font-bold text-white mb-2">{Math.round(weather.temperature)}°C</div>
            <div className="text-white/80 capitalize text-lg">{weather.description}</div>
            <div className="text-white/60 text-sm mt-1">Feels like {Math.round(weather.feelsLike)}°C</div>
          </div>

          {/* Weather Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Droplets className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-sm text-white/60">Humidity</div>
                <div className="font-semibold">{weather.humidity}%</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <Wind className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-sm text-white/60">Wind Speed</div>
                <div className="font-semibold">{weather.windSpeed} m/s</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <Gauge className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-sm text-white/60">Pressure</div>
                <div className="font-semibold">{weather.pressure} hPa</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <Eye className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-sm text-white/60">Visibility</div>
                <div className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
