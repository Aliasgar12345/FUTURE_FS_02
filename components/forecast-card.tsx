"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wind, Droplets } from "lucide-react"
import type { ForecastData } from "@/app/page"

interface ForecastCardProps {
  forecast: ForecastData
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`
  const date = new Date(forecast.date)
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
  const dayDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-4 text-center">
        <div className="text-white font-semibold mb-1">{dayName}</div>
        <div className="text-white/60 text-sm mb-3">{dayDate}</div>

        <div className="flex justify-center mb-3">
          <img src={iconUrl || "/placeholder.svg"} alt={forecast.description} className="w-12 h-12" />
        </div>

        <div className="text-white capitalize text-sm mb-3">{forecast.description}</div>

        <div className="text-white mb-3">
          <div className="text-lg font-bold">{Math.round(forecast.temperature.max)}°</div>
          <div className="text-sm text-white/60">{Math.round(forecast.temperature.min)}°</div>
        </div>

        <div className="space-y-2 text-xs text-white/80">
          <div className="flex items-center justify-center gap-1">
            <Droplets className="h-3 w-3" />
            <span>{forecast.humidity}%</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Wind className="h-3 w-3" />
            <span>{forecast.windSpeed} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
