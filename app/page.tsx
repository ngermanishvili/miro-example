import Header from "./components/Header";
import StreamingServices from "./components/StreamingServices";
import ContentTypeSwitcher from "./components/ContentTypeSwitcher";
import MovieRow from "./components/MovieRow";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TVShows from "./tv-shows/page";
import ImagePath from "@/public/assets/dashboard/covers/cyb3.jpg";
import TVShowsMainPage from "@/components/tv-series/tv-series-company";

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
        <ContentTypeSwitcher />
        <TVShowsMainPage />
      </main>
      <Footer />
    </div>
  );
}
