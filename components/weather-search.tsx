"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"

interface WeatherSearchProps {
  onSearch: (city: string) => void
  loading: boolean
  disabled?: boolean
}

export function WeatherSearch({ onSearch, loading, disabled = false }: WeatherSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim() && !disabled) {
      onSearch(searchTerm.trim())
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder={disabled ? "API key required..." : "Enter city name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            disabled={loading || disabled}
          />
          <Button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
            disabled={loading || !searchTerm.trim() || disabled}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
