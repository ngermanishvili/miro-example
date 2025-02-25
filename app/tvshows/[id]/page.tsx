// app/tv-shows/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import TVShowDetailPage from "@/app/tv-shows/[id]/page";
import TVShowDetails from "@/components/tv_series/details/TVShowDetails";

interface TVShowsDetailsPageProps {
    params: {
        id: string;
    };
}

// დინამიური მეტადატა გვერდისთვის
export async function generateMetadata({ params }: TVShowsDetailsPageProps): Promise<Metadata> {
    const { id } = params;

    try {
        const show = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tv-series/${id}`, {
            next: { revalidate: 3600 }, // 1 საათი
        }).then((res) => res.json());

        if (!show || show.error) {
            return {
                title: "სერიალი ვერ მოიძებნა",
                description: "მოთხოვნილი სერიალი ვერ მოიძებნა",
            };
        }

        return {
            title: `${show.title_geo || show.title_eng} | MyFlix`,
            description: show.overview_geo || show.overview_eng || `უყურეთ ${show.title_geo || show.title_eng} MyFlix-ზე`,
            openGraph: {
                images: show.backdrop_path_tmdb
                    ? [`https://image.tmdb.org/t/p/w1280${show.backdrop_path_tmdb}`]
                    : show.backdrop_poster_url
                        ? [show.backdrop_poster_url]
                        : ["/default-backdrop.jpg"],
            },
        };
    } catch (error) {
        console.error("Error fetching TV show metadata:", error);
        return {
            title: "სერიალი | MyFlix",
            description: "უყურეთ სერიალებს MyFlix-ზე",
        };
    }
}

export default async function TVShowDetailsPage({ params }: TVShowsDetailsPageProps) {
    const { id } = params;

    try {
        const show = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tv-series/${id}`, {
            next: { revalidate: 3600 }, // 1 საათი
        }).then((res) => res.json());

        if (!show || show.error) {
            notFound();
        }

        return <TVShowDetails show={show} />;
    } catch (error) {
        console.error("Error fetching TV show details:", error);
        notFound();
    }
}