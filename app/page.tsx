"use client"

import { useState, useEffect } from "react"
import { WeatherSearch } from "@/components/weather-search"
import { WeatherCard } from "@/components/weather-card"
import { ForecastCard } from "@/components/forecast-card"
import { FavoriteCities } from "@/components/favorite-cities"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export interface WeatherData {
  city: string
  country: string
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  feelsLike: number
  pressure: number
  visibility: number
}

export interface ForecastData {
  date: string
  temperature: {
    min: number
    max: number
  }
  humidity: number
  windSpeed: number
  description: string
  icon: string
}

// Mock data for demo mode
const getMockWeatherData = (city: string): WeatherData => ({
  city: city,
  country: "Demo",
  temperature: Math.floor(Math.random() * 30) + 5,
  humidity: Math.floor(Math.random() * 40) + 40,
  windSpeed: Math.floor(Math.random() * 10) + 2,
  description: ["sunny", "cloudy", "partly cloudy", "light rain"][Math.floor(Math.random() * 4)],
  icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)],
  feelsLike: Math.floor(Math.random() * 30) + 5,
  pressure: Math.floor(Math.random() * 100) + 1000,
  visibility: Math.floor(Math.random() * 5000) + 5000,
})

const getMockForecastData = (): ForecastData[] => {
  const forecast = []
  for (let i = 1; i <= 5; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    forecast.push({
      date: date.toISOString(),
      temperature: {
        min: Math.floor(Math.random() * 15) + 5,
        max: Math.floor(Math.random() * 15) + 20,
      },
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 10) + 2,
      description: ["sunny", "cloudy", "partly cloudy", "light rain"][Math.floor(Math.random() * 4)],
      icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)],
    })
  }
  return forecast
}

export default function WeatherApp() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeyError, setApiKeyError] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [demoMode, setDemoMode] = useState(false)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites))
  }, [favorites])

  const fetchWeatherData = async (city: string) => {
    setLoading(true)
    setError(null)
    setApiKeyError(false)

    // Demo mode - use mock data
    if (demoMode) {
      setTimeout(() => {
        setCurrentWeather(getMockWeatherData(city))
        setForecast(getMockForecastData())
        setLoading(false)
      }, 1000)
      return
    }

    try {
      console.log("Searching for weather in:", city)

      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      console.log("Weather response status:", weatherResponse.status)

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json()

        if (weatherResponse.status === 401) {
          setApiKeyError(true)
          throw new Error("Invalid API key. Please check your OpenWeatherMap API key configuration.")
        }

        throw new Error(errorData.error || "Weather data not found")
      }

      const weatherData = await weatherResponse.json()
      console.log("Weather data received:", weatherData)
      setCurrentWeather(weatherData)

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`)
      console.log("Forecast response status:", forecastResponse.status)

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json()
        console.warn("Forecast failed:", errorData.error)
        // Don't throw error for forecast failure, just set empty array
        setForecast([])
      } else {
        const forecastData = await forecastResponse.json()
        console.log("Forecast data received:", forecastData.length, "days")
        setForecast(forecastData)
      }
    } catch (err) {
      console.error("Error fetching weather data:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching weather data")
      setCurrentWeather(null)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = (city: string) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city])
    }
  }

  const removeFromFavorites = (city: string) => {
    setFavorites(favorites.filter((fav) => fav !== city))
  }

  const handleFavoriteClick = (city: string) => {
    fetchWeatherData(city)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Weather App</h1>
          <p className="text-blue-100">Get current weather and forecasts for any city</p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center space-x-2">
              <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} />
              <Label htmlFor="demo-mode" className="text-white">
                Demo Mode {demoMode && "(Using mock data)"}
              </Label>
            </div>
          </Card>
        </div>

        {/* API Key Error Alert */}
        {apiKeyError && !demoMode && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">API Key Issue Detected</AlertTitle>
            <AlertDescription className="text-red-700 space-y-3">
              <p>Your OpenWeatherMap API key is not working. Here's how to fix it:</p>

              <div className="bg-red-100 p-3 rounded text-sm">
                <p className="font-semibold mb-2">Step-by-step solution:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>
                    Go to{" "}
                    <a
                      href="https://openweathermap.org/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      OpenWeatherMap API
                    </a>
                  </li>
                  <li>Sign up or log in to your account</li>
                  <li>Go to "My API keys" section</li>
                  <li>Generate a new API key (free tier available)</li>
                  <li>Wait 10-120 minutes for activation (this is important!)</li>
                  <li>Update your OPENWEATHERMAP_API_KEY environment variable</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://openweathermap.org/api", "_blank")}
                >
                  Get API Key <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDemoMode(true)}>
                  Try Demo Mode
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Mode Info */}
        {demoMode && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Demo Mode Active</AlertTitle>
            <AlertDescription className="text-blue-700">
              You're using mock weather data. Turn off demo mode once your API key is working to get real weather data.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search and Favorites Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <WeatherSearch onSearch={fetchWeatherData} loading={loading} disabled={apiKeyError && !demoMode} />
            <FavoriteCities
              favorites={favorites}
              onFavoriteClick={handleFavoriteClick}
              onRemoveFavorite={removeFromFavorites}
              disabled={apiKeyError && !demoMode}
            />
          </div>

          {/* Main Weather Content */}
          <div className="lg:col-span-3">
            {error && !apiKeyError && (
              <Card className="p-6 mb-4 bg-red-50 border-red-200">
                <p className="text-red-600 text-center">{error}</p>
              </Card>
            )}

            {currentWeather && (
              <div className="space-y-6">
                <WeatherCard
                  weather={currentWeather}
                  onAddToFavorites={addToFavorites}
                  isFavorite={favorites.includes(currentWeather.city)}
                  isDemo={demoMode}
                />

                <Tabs defaultValue="forecast" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
                  </TabsList>
                  <TabsContent value="forecast" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {forecast.map((day, index) => (
                        <ForecastCard key={index} forecast={day} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {!currentWeather && !loading && !error && (
              <Card className="p-12 text-center bg-white/10 backdrop-blur-sm border-white/20">
                <div className="text-white">
                  <h2 className="text-2xl font-semibold mb-2">Welcome to Weather App</h2>
                  <p className="text-blue-100">
                    {apiKeyError && !demoMode
                      ? "Please configure your API key or enable demo mode to get started"
                      : "Search for a city to get started or select from your favorites"}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
