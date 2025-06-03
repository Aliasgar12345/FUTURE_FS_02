import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    console.error("OpenWeatherMap API key not found in environment variables")
    return NextResponse.json(
      {
        error: "API key not configured. Please set OPENWEATHERMAP_API_KEY environment variable.",
      },
      { status: 500 },
    )
  }

  // Validate API key format (OpenWeatherMap keys are typically 32 characters)
  if (apiKey.length < 10) {
    console.error("OpenWeatherMap API key appears to be invalid (too short)")
    return NextResponse.json(
      {
        error: "Invalid API key format. Please check your OPENWEATHERMAP_API_KEY.",
      },
      { status: 500 },
    )
  }

  // Add this console log after the line that gets the API key:
  console.log("Using API key starting with:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 5))

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    console.log("Fetching weather data for:", city)
    console.log("API Key length:", apiKey.length, "characters")

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("API Response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error Response:", errorData)

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Invalid API key. Please verify your OpenWeatherMap API key is correct and active.",
          },
          { status: 401 },
        )
      }
      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "City not found. Please check the spelling and try again.",
          },
          { status: 404 },
        )
      }
      return NextResponse.json(
        {
          error: `Weather service error: ${errorData.message || response.status}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Weather data received for:", data.name)

    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      feelsLike: data.main.feels_like,
      pressure: data.main.pressure,
      visibility: data.visibility || 10000,
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error details:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch weather data. Please try again later.",
      },
      { status: 500 },
    )
  }
}
