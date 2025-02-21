import Image from "next/image"
import { PlayCircle, InfoIcon } from "lucide-react"

interface HeroProps {
  title_eng: string;
  title_geo: string;
  description_eng: string | null;
  description_geo: string | null;
  imagePath: string;
  logoPath?: string | null;
  releaseYear?: string | null;
  imdbRating?: string | null;
}

export default function Hero({
  title_eng,
  title_geo,
  description_eng,
  description_geo,
  imagePath,
  logoPath,
  releaseYear,
  imdbRating
}: HeroProps) {
  return (
    <div className="relative h-[80vh] flex items-center">
      <Image
        src={imagePath || "/placeholder.svg"}
        alt={title_eng}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative container mx-auto px-4">
        {logoPath ? (
          <div className="w-2/5 mb-6">
            <Image
              src={`https://image.tmdb.org/t/p/original${logoPath}`}
              alt={title_eng}
              width={400}
              height={200}
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold mb-2 max-w-2xl leading-tight">{title_geo}</h1>
            <h2 className="text-2xl mb-4 text-gray-400">{title_eng}</h2>
          </>
        )}

        <div className="flex items-center space-x-4 mb-4">
          {releaseYear && (
            <span className="text-sm text-gray-300">{releaseYear}</span>
          )}
          {imdbRating && (
            <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded">
              IMDb {imdbRating}
            </span>
          )}
        </div>

        <p className="text-lg mb-8 max-w-xl text-gray-300">
          {description_geo || description_eng}
        </p>

        <div className="flex space-x-4">
          <button className="flex items-center bg-white text-black py-3 px-8 rounded-md hover:bg-gray-200 transition duration-300">
            <PlayCircle className="w-6 h-6 mr-2" />
            Play
          </button>
          <button className="flex items-center bg-gray-600 bg-opacity-70 text-white py-3 px-8 rounded-md hover:bg-opacity-100 transition duration-300">
            <InfoIcon className="w-6 h-6 mr-2" />
            More Info
          </button>
        </div>
      </div>
    </div>
  )
}