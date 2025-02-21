"use client"
import { useState } from "react"
import Image from "next/image"
import { PlayCircle, Plus } from "lucide-react"
import MovieModal from "./MovieModal"

interface Movie {
  id: number
  title: string
  posterPath: string
  overview?: string
  voteAverage?: number
}

interface MovieRowProps {
  title: string
  movies: Movie[]
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-[250px] transition-transform hover:scale-105 duration-300"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="relative h-[140px] w-[250px] rounded-md overflow-hidden shadow-lg group cursor-pointer">
                <Image
                  src={movie.posterPath || "/placeholder.svg"}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    className="bg-white text-black p-2 rounded-full mr-2 hover:bg-opacity-80 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle play action
                    }}
                  >
                    <PlayCircle className="w-6 h-6" />
                  </button>
                  <button
                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-opacity-80 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle add to list action
                    }}
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute top-0 bottom-8 left-0 bg-gradient-to-r from-black to-transparent w-12" />
        <div className="absolute top-0 bottom-8 right-0 bg-gradient-to-l from-black to-transparent w-12" />
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}