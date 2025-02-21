"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import useSWRInfinite from 'swr/infinite';
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

interface TVShow {
  id: number;
  title_eng: string;
  title_geo: string;
  description_eng: string | null;
  description_geo: string | null;
  imdb_vote: string | null;
  backdrop_poster_url: string | null;
  backdrop_path_tmdb: string | null;
  release_date: string | null;
  poster_logo: { logo_path: string } | null;
}

interface TVShowsApiResponse {
  series: TVShow[];
  page: number;
  limit: number;
  hasMore: boolean;
}

const FALLBACK_IMAGE = '/placeholder.svg';

// Fetcher ფუნქცია SWR-ისთვის
const fetcher = (url: string) => fetch(url).then(res => res.json());

// getKey ფუნქცია useSWRInfinite-ისთვის
const getKey = (pageIndex: number, previousPageData: TVShowsApiResponse | null) => {
  // როცა მეტი დატა აღარ არის, null ვაბრუნებთ
  if (previousPageData && !previousPageData.hasMore) return null;

  // პირველი გვერდი
  return `/api/tv-series?page=${pageIndex + 1}&limit=20`;
};

export default function TVShows() {
  const {
    data,
    error,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate
  } = useSWRInfinite<TVShowsApiResponse>(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    persistSize: true,
    dedupingInterval: 3600000, // 1 საათი
  });

  // ყველა სერიის გაერთიანება
  const shows = data ? data.flatMap(page => page.series) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.series.length === 0;
  const hasMore = data?.at(-1)?.hasMore ?? false;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Failed to load shows</p>
          <button
            onClick={() => mutate()} // მონაცემების ხელახლა ჩატვირთვა
            className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      {shows.length > 0 && (
        <Hero
          title_eng={shows[4].title_eng}
          title_geo={shows[4].title_geo}
          description_eng={shows[4].description_eng}
          description_geo={shows[4].description_geo}
          imagePath={shows[4]?.backdrop_poster_url ||
            (shows[4]?.backdrop_path_tmdb ?
              `https://image.tmdb.org/t/p/original${shows[4].backdrop_path_tmdb}` :
              FALLBACK_IMAGE)
          }
          logoPath={shows[4]?.poster_logo?.logo_path}
          releaseYear={shows[4]?.release_date ?
            new Date(shows[4].release_date).getFullYear().toString() :
            null
          }
          imdbRating={shows[4]?.imdb_vote}
        />
      )}

      <main className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <h2 className="text-2xl font-bold mb-6">სატელევიზიო შოუები</h2>

        {isLoading && !shows.length ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
              {shows.map((show) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05, zIndex: 1 }}
                >
                  <div className="relative aspect-video rounded-sm overflow-hidden bg-zinc-900">
                    <Image
                      src={show.backdrop_poster_url ||
                        (show.backdrop_path_tmdb ?
                          `https://image.tmdb.org/t/p/w500${show.backdrop_path_tmdb}` :
                          FALLBACK_IMAGE)
                      }
                      alt={show.title_geo}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover"
                      loading="lazy"
                    />

                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {show.poster_logo?.logo_path && (
                      <div className="absolute bottom-2 left-2 w-[70%] h-8">
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${show.poster_logo.logo_path}`}
                          alt="Logo"
                          fill
                          className="object-contain object-left"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {show.imdb_vote && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-white">{show.imdb_vote}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/50">
                      <Play className="w-8 h-8 text-white/90 hover:text-white" />
                    </div>
                  </div>

                  <div className="mt-1">
                    <p className="text-xs text-gray-300 line-clamp-1">{show.title_geo}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{show.title_eng}</p>
                    {show.release_date && (
                      <span className="text-xs text-gray-500">
                        {new Date(show.release_date).getFullYear()}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && !isLoadingMore && (
              <button
                onClick={() => setSize(size + 1)}
                className="mx-auto mt-8 block bg-red-600 px-6 py-2 rounded-md hover:bg-red-700"
                disabled={isValidating}
              >
                {isValidating ? 'იტვირთება...' : 'მეტის ჩვენება'}
              </button>
            )}

            {isValidating && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}

            {isEmpty && (
              <div className="text-center py-10">
                <p className="text-gray-400">შოუები ვერ მოიძებნა</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}