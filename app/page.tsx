"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ContentTypeSwitcher, { ContentType } from "./components/ContentTypeSwitcher";
import Footer from "./components/Footer";
import TVShowsMainPage from "@/components/tv-series/tv-series-company";
import MoviesMainPage from "@/components/movies/movies-company";

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>("movies");

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
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
        {contentType === "movies" ? (
          <MoviesMainPage />
        ) : (
          <TVShowsMainPage />
        )}
      </main>
      <Footer />
    </div>
  );
}