"use client"

import { useState } from "react"
import { TvIcon, FilmIcon } from "lucide-react"
import type { ContentType } from "@/types/tv"

interface ContentTypeSwitcherProps {
  onTypeChange?: (type: ContentType) => void;
  initialType?: ContentType;
}

export default function ContentTypeSwitcher({ onTypeChange, initialType = "movies" }: ContentTypeSwitcherProps) {
  const [activeType, setActiveType] = useState<ContentType>(initialType)

  const handleTypeChange = (type: ContentType) => {
    setActiveType(type);
    onTypeChange?.(type);
  }

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-800 p-1 rounded-full flex">
        <button
          onClick={() => handleTypeChange("movies")}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${activeType === "movies" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"
            }`}
        >
          <FilmIcon className="w-5 h-5 mr-2" />
          Movies
        </button>
        <button
          onClick={() => handleTypeChange("tvshows")}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${activeType === "tvshows" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"
            }`}
        >
          <TvIcon className="w-5 h-5 mr-2" />
          TV Shows
        </button>
      </div>
    </div>
  )
}