"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ContentTypeSwitcher, {
  ContentType,
} from "./components/ContentTypeSwitcher";
import Footer from "./components/Footer";
import TVShowsMainPage from "@/components/tv_series/tv-series-company";
import MoviesMainPage from "@/components/movies/movies-company";
import MovieSearchModal from "@/components/movies/search/MovieSearchModal";

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>("movies");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search modal

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
  };

  // Function to open search modal
  const openSearchModal = () => {
    setIsSearchOpen(true);
  };

  // Function to close search modal
  const closeSearchModal = () => {
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Pass the openSearchModal function to Header */}
      <Header onOpenSearch={openSearchModal} />

      <Hero
        title_eng="Example Title ENG"
        title_geo="Example Title GEO"
        description_eng="Example Description ENG"
        description_geo="Example Description GEO"
        imagePath="/example-image-path.jpg"
      />

      <ContentTypeSwitcher
        onTypeChange={handleContentTypeChange}
        initialType={contentType}
      />

      <main className="relative z-10 px-4 lg:px-12">
        {contentType === "movies" ? <MoviesMainPage /> : <TVShowsMainPage />}
      </main>

      <Footer />

      {/* Movie search modal placed at the root level, outside of Header */}
      <MovieSearchModal
        isOpen={isSearchOpen}
        onClose={closeSearchModal}
      />
    </div>
  );
}