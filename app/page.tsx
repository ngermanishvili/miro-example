import Header from "./components/Header"
import StreamingServices from "./components/StreamingServices"
import ContentTypeSwitcher from "./components/ContentTypeSwitcher"
import MovieRow from "./components/MovieRow"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import ImagePath from "@/public/assets/dashboard/covers/cyb3.jpg"

// Mock data for movie categories
const categories = [
  {
    title: "Popular on Netflix",
    movies: [
      {
        id: 1,
        title: "Stranger Things",
        posterPath: "/placeholder.svg",
        description:
          "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
        releaseYear: 2016,
        duration: "4 Seasons",
        genre: "Sci-Fi & Fantasy",
      },
      {
        id: 2,
        title: "The Witcher",
        posterPath: "/placeholder.svg",
        description:
          "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
        releaseYear: 2019,
        duration: "2 Seasons",
        genre: "Fantasy",
      },
      {
        id: 3,
        title: "Bridgerton",
        posterPath: "/placeholder.svg",
        description:
          "The eight close-knit siblings of the Bridgerton family look for love and happiness in London high society.",
        releaseYear: 2020,
        duration: "2 Seasons",
        genre: "Period Drama",
      },
      {
        id: 4,
        title: "Money Heist",
        posterPath: "/placeholder.svg",
        description:
          "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
        releaseYear: 2017,
        duration: "5 Parts",
        genre: "Crime",
      },
      {
        id: 5,
        title: "The Crown",
        posterPath: "/placeholder.svg",
        description:
          "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
        releaseYear: 2016,
        duration: "4 Seasons",
        genre: "Historical Drama",
      },
      {
        id: 6,
        title: "Squid Game",
        posterPath: "/placeholder.svg",
        description:
          "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Thriller",
      },
    ],
  },
  {
    title: "Trending Now",
    movies: [
      {
        id: 7,
        title: "Ozark",
        posterPath: "/placeholder.svg",
        description:
          "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
        releaseYear: 2017,
        duration: "4 Seasons",
        genre: "Crime",
      },
      {
        id: 8,
        title: "The Queen's Gambit",
        posterPath: "/placeholder.svg",
        description:
          "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
        releaseYear: 2020,
        duration: "Limited Series",
        genre: "Drama",
      },
      {
        id: 9,
        title: "Lupin",
        posterPath: "/placeholder.svg",
        description:
          "Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
        releaseYear: 2021,
        duration: "2 Parts",
        genre: "Mystery",
      },
      {
        id: 10,
        title: "Cobra Kai",
        posterPath: "/placeholder.svg",
        description:
          "Decades after the tournament that changed their lives, the rivalry between Johnny and Daniel reignites in this sequel to the Karate Kid films.",
        releaseYear: 2018,
        duration: "4 Seasons",
        genre: "Action",
      },
      {
        id: 11,
        title: "Dark",
        posterPath: "/placeholder.svg",
        description:
          "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
        releaseYear: 2017,
        duration: "3 Seasons",
        genre: "Sci-Fi",
      },
      {
        id: 12,
        title: "The Umbrella Academy",
        posterPath: "/placeholder.svg",
        description:
          "Reunited by their father's death, estranged siblings with extraordinary powers uncover shocking family secrets — and a looming threat to humanity.",
        releaseYear: 2019,
        duration: "3 Seasons",
        genre: "Sci-Fi",
      },
    ],
  },
  {
    title: "Netflix",
    movies: [
      {
        id: 123143,
        title: "Shadow and Bone",
        posterPath: "/placeholder.svg",
        description:
          "Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power that could change the fate of her war-torn world.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Fantasy",
      },
      {
        id: 14,
        title: "Jupiter's Legacy",
        posterPath: "/placeholder.svg",
        description:
          "They're the first generation of superheroes. But as they pass the torch to their children, tensions are rising — and the old rules no longer apply.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Superhero",
      },
      {
        id: 15,
        title: "The Irregulars",
        posterPath: "/placeholder.svg",
        description:
          "A group of misfits investigates a series of supernatural crimes in Victorian London for Dr. Watson and his shadowy associate, Sherlock Holmes.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Mystery",
      },
      {
        id: 16,
        title: "Who Killed Sara?",
        posterPath: "/placeholder.svg",
        description:
          "Hell-bent on exacting revenge and proving he was framed for his sister's murder, Álex sets out to unearth much more than the crime's real culprit.",
        releaseYear: 2021,
        duration: "2 Seasons",
        genre: "Thriller",
      },
      {
        id: 17,
        title: "The Serpent",
        posterPath: "/placeholder.svg",
        description:
          "In the 1970s, merciless killer Charles Sobhraj preys on travelers exploring the 'hippie trail' of South Asia. Based on shocking true events.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Crime",
      },
      {
        id: 18,
        title: "Behind Her Eyes",
        posterPath: "/placeholder.svg",
        description:
          "A single mother enters a world of twisted mind games when she begins an affair with her psychiatrist boss while secretly befriending his mysterious wife.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Psychological Thriller",
      },
    ],
  },
  {
    title: "Amazon + ",
    movies: [
      {
        id: 42513,
        title: "Shadow and Bone",
        posterPath: "/placeholder.svg",
        description:
          "Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power that could change the fate of her war-torn world.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Fantasy",
      },
      {
        id: 14,
        title: "Jupiter's Legacy",
        posterPath: "/placeholder.svg",
        description:
          "They're the first generation of superheroes. But as they pass the torch to their children, tensions are rising — and the old rules no longer apply.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Superhero",
      },
      {
        id: 15,
        title: "The Irregulars",
        posterPath: "/placeholder.svg",
        description:
          "A group of misfits investigates a series of supernatural crimes in Victorian London for Dr. Watson and his shadowy associate, Sherlock Holmes.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Mystery",
      },
      {
        id: 16,
        title: "Who Killed Sara?",
        posterPath: "/placeholder.svg",
        description:
          "Hell-bent on exacting revenge and proving he was framed for his sister's murder, Álex sets out to unearth much more than the crime's real culprit.",
        releaseYear: 2021,
        duration: "2 Seasons",
        genre: "Thriller",
      },
      {
        id: 17,
        title: "The Serpent",
        posterPath: "/placeholder.svg",
        description:
          "In the 1970s, merciless killer Charles Sobhraj preys on travelers exploring the 'hippie trail' of South Asia. Based on shocking true events.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Crime",
      },
      {
        id: 18,
        title: "Behind Her Eyes",
        posterPath: "/placeholder.svg",
        description:
          "A single mother enters a world of twisted mind games when she begins an affair with her psychiatrist boss while secretly befriending his mysterious wife.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Psychological Thriller",
      },
    ],
  },
  {
    title: "HBO ",
    movies: [
      {
        id: 13,
        title: "Shadow and Bone",
        posterPath: "/placeholder.svg",
        description:
          "Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power that could change the fate of her war-torn world.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Fantasy",
      },
      {
        id: 14,
        title: "Jupiter's Legacy",
        posterPath: "/placeholder.svg",
        description:
          "They're the first generation of superheroes. But as they pass the torch to their children, tensions are rising — and the old rules no longer apply.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Superhero",
      },
      {
        id: 15,
        title: "The Irregulars",
        posterPath: "/placeholder.svg",
        description:
          "A group of misfits investigates a series of supernatural crimes in Victorian London for Dr. Watson and his shadowy associate, Sherlock Holmes.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Mystery",
      },
      {
        id: 16,
        title: "Who Killed Sara?",
        posterPath: "/placeholder.svg",
        description:
          "Hell-bent on exacting revenge and proving he was framed for his sister's murder, Álex sets out to unearth much more than the crime's real culprit.",
        releaseYear: 2021,
        duration: "2 Seasons",
        genre: "Thriller",
      },
      {
        id: 17,
        title: "The Serpent",
        posterPath: "/placeholder.svg",
        description:
          "In the 1970s, merciless killer Charles Sobhraj preys on travelers exploring the 'hippie trail' of South Asia. Based on shocking true events.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Crime",
      },
      {
        id: 18,
        title: "Behind Her Eyes",
        posterPath: "/placeholder.svg",
        description:
          "A single mother enters a world of twisted mind games when she begins an affair with her psychiatrist boss while secretly befriending his mysterious wife.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Psychological Thriller",
      },
    ],
  },
  {
    title: "Paramount ",
    movies: [
      {
        id: 4113,
        title: "Shadow and Bone",
        posterPath: "/placeholder.svg",
        description:
          "Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power that could change the fate of her war-torn world.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Fantasy",
      },
      {
        id: 14,
        title: "Jupiter's Legacy",
        posterPath: "/placeholder.svg",
        description:
          "They're the first generation of superheroes. But as they pass the torch to their children, tensions are rising — and the old rules no longer apply.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Superhero",
      },
      {
        id: 15,
        title: "The Irregulars",
        posterPath: "/placeholder.svg",
        description:
          "A group of misfits investigates a series of supernatural crimes in Victorian London for Dr. Watson and his shadowy associate, Sherlock Holmes.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Mystery",
      },
      {
        id: 16,
        title: "Who Killed Sara?",
        posterPath: "/placeholder.svg",
        description:
          "Hell-bent on exacting revenge and proving he was framed for his sister's murder, Álex sets out to unearth much more than the crime's real culprit.",
        releaseYear: 2021,
        duration: "2 Seasons",
        genre: "Thriller",
      },
      {
        id: 17,
        title: "The Serpent",
        posterPath: "/placeholder.svg",
        description:
          "In the 1970s, merciless killer Charles Sobhraj preys on travelers exploring the 'hippie trail' of South Asia. Based on shocking true events.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Crime",
      },
      {
        id: 18,
        title: "Behind Her Eyes",
        posterPath: "/placeholder.svg",
        description:
          "A single mother enters a world of twisted mind games when she begins an affair with her psychiatrist boss while secretly befriending his mysterious wife.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Psychological Thriller",
      },
    ],
  },
  {
    title: "Hulu",
    movies: [
      {
        id: 123213,
        title: "Shadow and Bone",
        posterPath: "/placeholder.svg",
        description:
          "Dark forces conspire against orphan mapmaker Alina Starkov when she unleashes an extraordinary power that could change the fate of her war-torn world.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Fantasy",
      },
      {
        id: 14,
        title: "Jupiter's Legacy",
        posterPath: "/placeholder.svg",
        description:
          "They're the first generation of superheroes. But as they pass the torch to their children, tensions are rising — and the old rules no longer apply.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Superhero",
      },
      {
        id: 15,
        title: "The Irregulars",
        posterPath: "/placeholder.svg",
        description:
          "A group of misfits investigates a series of supernatural crimes in Victorian London for Dr. Watson and his shadowy associate, Sherlock Holmes.",
        releaseYear: 2021,
        duration: "1 Season",
        genre: "Mystery",
      },
      {
        id: 16,
        title: "Who Killed Sara?",
        posterPath: "/placeholder.svg",
        description:
          "Hell-bent on exacting revenge and proving he was framed for his sister's murder, Álex sets out to unearth much more than the crime's real culprit.",
        releaseYear: 2021,
        duration: "2 Seasons",
        genre: "Thriller",
      },
      {
        id: 17,
        title: "The Serpent",
        posterPath: "/placeholder.svg",
        description:
          "In the 1970s, merciless killer Charles Sobhraj preys on travelers exploring the 'hippie trail' of South Asia. Based on shocking true events.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Crime",
      },
      {
        id: 18,
        title: "Behind Her Eyes",
        posterPath: "/placeholder.svg",
        description:
          "A single mother enters a world of twisted mind games when she begins an affair with her psychiatrist boss while secretly befriending his mysterious wife.",
        releaseYear: 2021,
        duration: "Limited Series",
        genre: "Psychological Thriller",
      },
    ],
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <Hero
        title_eng="Samurai Jack"
        title_geo="Example Title GEO"
        description_eng="Example Description ENG"
        description_geo="Example Description GEO"
        imagePath="/example-image-path.jpg"
      />

      <main className="relative z-10 px-4 lg:px-12">
        <StreamingServices />
        <ContentTypeSwitcher />
        <div className="relative">
          {categories.map((category, index) => (
            <MovieRow
              key={index}
              title={category.title}
              movies={category.movies}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}