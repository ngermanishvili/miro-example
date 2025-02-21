import Header from "../components/Header"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import Footer from "../components/Footer"

// Mock data for movie categories
const categories = [
  {
    title: "Popular Movies",
    movies: [
      { id: 1, title: "The Irishman", posterPath: "/placeholder.svg" },
      { id: 2, title: "Extraction", posterPath: "/placeholder.svg" },
      { id: 3, title: "Bird Box", posterPath: "/placeholder.svg" },
      { id: 4, title: "The Old Guard", posterPath: "/placeholder.svg" },
      { id: 5, title: "Roma", posterPath: "/placeholder.svg" },
      { id: 6, title: "The Ballad of Buster Scruggs", posterPath: "/placeholder.svg" },
    ],
  },
  {
    title: "Trending Movies",
    movies: [
      { id: 7, title: "Mank", posterPath: "/placeholder.svg" },
      { id: 8, title: "The Trial of the Chicago 7", posterPath: "/placeholder.svg" },
      { id: 9, title: "Da 5 Bloods", posterPath: "/placeholder.svg" },
      { id: 10, title: "Marriage Story", posterPath: "/placeholder.svg" },
      { id: 11, title: "The Two Popes", posterPath: "/placeholder.svg" },
      { id: 12, title: "El Camino", posterPath: "/placeholder.svg" },
    ],
  },
  {
    title: "New Movie Releases",
    movies: [
      { id: 13, title: "Army of the Dead", posterPath: "/placeholder.svg" },
      { id: 14, title: "The Midnight Sky", posterPath: "/placeholder.svg" },
      { id: 15, title: "Enola Holmes", posterPath: "/placeholder.svg" },
      { id: 16, title: "Project Power", posterPath: "/placeholder.svg" },
      { id: 17, title: "The Devil All the Time", posterPath: "/placeholder.svg" },
      { id: 18, title: "Rebecca", posterPath: "/placeholder.svg" },
    ],
  },
]

export default function Movies() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero
        title="Movies"
        subtitle="Discover the latest blockbusters and timeless classics"
        imagePath="/movies-hero.jpg"
      />
      <main className="container mx-auto px-4 pb-8">
        <h1 className="text-4xl font-bold my-8">Movies</h1>
        <div className="-mx-4">
          {categories.map((category, index) => (
            <MovieRow key={index} title={category.title} movies={category.movies} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

