// ContentTypeSwitcher.tsx
"use client";

import { useState, useCallback } from "react";
import { TvIcon, FilmIcon } from "lucide-react";

export type ContentType = "movies" | "tvshows";

interface ContentTypeSwitcherProps {
  onTypeChange: (type: ContentType) => void; // Make onTypeChange required
  initialType?: ContentType;
}

export default function ContentTypeSwitcher({
  onTypeChange,
  initialType = "movies"
}: ContentTypeSwitcherProps) {
  const [activeType, setActiveType] = useState<ContentType>(initialType);

  const handleTypeChange = useCallback((type: ContentType) => {
    setActiveType(type);
    onTypeChange(type);
  }, [onTypeChange]); // useCallback to prevent unnecessary re-renders

  return (
    <div className="flex justify-center ">
      <div className="bg-gray-800 p-1 rounded-full flex mt-12">
        <button
          onClick={() => handleTypeChange("movies")}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${activeType === "movies"
            ? "bg-[#42D791] text-white"
            : "text-gray-300 hover:text-white"
            }`}
        >
          <FilmIcon className="w-5 h-5 mr-2" />
          Movies
        </button>
        <button
          onClick={() => handleTypeChange("tvshows")}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${activeType === "tvshows"
            ? "bg-[#42D791] text-white"
            : "text-gray-300 hover:text-white"
            }`}
        >
          <TvIcon className="w-5 h-5 mr-2" />
          TV Shows
        </button>
      </div>
    </div>
  );
}
