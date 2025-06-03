"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, MapPin } from "lucide-react"

interface FavoriteCitiesProps {
  favorites: string[]
  onFavoriteClick: (city: string) => void
  onRemoveFavorite: (city: string) => void
  disabled?: boolean
}

export function FavoriteCities({
  favorites,
  onFavoriteClick,
  onRemoveFavorite,
  disabled = false,
}: FavoriteCitiesProps) {
  if (favorites.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Favorite Cities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 text-sm text-center">
            {disabled
              ? "Configure API key to use favorites"
              : "No favorite cities yet. Add some by clicking the heart icon on weather cards!"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Favorite Cities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {favorites.map((city) => (
            <div key={city} className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                className="flex-1 justify-start text-white hover:bg-white/20 p-2"
                onClick={() => onFavoriteClick(city)}
                disabled={disabled}
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span className="truncate">{city}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-red-400 hover:bg-white/20 p-1"
                onClick={() => onRemoveFavorite(city)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
