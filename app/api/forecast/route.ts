import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    console.error("OpenWeatherMap API key not found")
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  console.log("Using API key starting with:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5))

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    console.log("Fetching forecast data for:", city)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("Forecast API Response status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Forecast API Error Response:", errorData)

      if (response.status === 404) {
        return NextResponse.json({ error: "City not found for forecast data" }, { status: 404 })
      }
      if (response.status === 401) {
        return NextResponse.json({ error: "Invalid API key for forecast" }, { status: 401 })
      }
      return NextResponse.json({ error: `Forecast service error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("Forecast data received, entries:", data.list?.length || 0)

    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const processedDates = new Set()

    if (data.list && Array.isArray(data.list)) {
      for (const item of data.list) {
        const date = new Date(item.dt * 1000)
        const dateString = date.toDateString()

        if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
          processedDates.add(dateString)

          // Find min/max temperatures for the day
          const dayForecasts = data.list.filter((forecast: any) => {
            const forecastDate = new Date(forecast.dt * 1000)
            return forecastDate.toDateString() === dateString
          })

          const temperatures = dayForecasts.map((f: any) => f.main.temp)
          const minTemp = Math.min(...temperatures)
          const maxTemp = Math.max(...temperatures)

          dailyForecasts.push({
            date: date.toISOString(),
            temperature: {
              min: minTemp,
              max: maxTemp,
            },
            humidity: item.main.humidity,
            windSpeed: item.wind?.speed || 0,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          })
        }
      }
    }

    return NextResponse.json(dailyForecasts)
  } catch (error) {
    console.error("Forecast API error details:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch forecast data. Please try again later.",
      },
      { status: 500 },
    )
  }
}
