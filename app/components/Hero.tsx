// Hero.tsx
import Image from "next/image"
import HeroInfo from "./HeroInfo"
import Newsletter from "./ad-banner"

interface HeroProps {
  title_eng: string
  title_geo: string
  description_eng: string | null
  description_geo: string | null
  imagePath: string | null
  logoPath?: string | null
  releaseYear?: string | null
  imdbRating?: string | null
}

export default function Hero({
  title_eng,
  title_geo,
  description_eng,
  description_geo,
  imagePath,
  logoPath,
  releaseYear,
  imdbRating,
}: HeroProps) {
  return (
    <div className="relative h-[56.25vw] max-h-[90vh] min-h-[40vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        {imagePath && (
          <Image
            src="https://occ-0-5515-2774.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABWvQxpncNVZITVe9vit5lK-CqRiRLmuGoxV1BSnpBm1OsVZtJFOtQDkdAEehNWR5w5Jm2PjbVH9VvcLZSVGaZGKeVLv1l9xhnOSX.jpg?r=fdf"
            alt={title_eng}
            fill
            className="object-cover"
            priority
            quality={100}
          />
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <HeroInfo
          title_eng={title_eng}
          title_geo={title_geo}
          description_eng={description_eng}
          description_geo={description_geo}
          logoPath={logoPath}
          releaseYear={releaseYear}
          imdbRating={imdbRating}
        />
      </div>

      {/* Newsletter - now positioned absolutely within Hero */}
      <Newsletter />

      {/* Optional gradient overlay for better text visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#1a0404] to-transparent" />
    </div>
  )
}