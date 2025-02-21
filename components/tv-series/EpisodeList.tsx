"use client"

import Image from "next/image"
import { ChevronDown, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { Episode } from "@/types/tv"

// components/tv-series/EpisodeList.tsx

interface EpisodeListProps {
    episodes: Episode[];
    onEpisodeSelect?: (episode: Episode) => void;
    selectedEpisode: Episode | null;
}

export default function EpisodeList({ episodes, onEpisodeSelect, selectedEpisode }: EpisodeListProps) {
    // Group episodes by season
    const seasons = episodes.reduce((acc, episode) => {
        const season = acc.get(episode.season) || [];
        season.push(episode);
        return acc.set(episode.season, season.sort((a, b) => a.episode - b.episode));
    }, new Map<number, Episode[]>());

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">ეპიზოდები</h2>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={`season-${selectedEpisode?.season}`} // ავტომატურად გახსნას არჩეული სეზონი
            >
                {Array.from(seasons.entries()).sort(([a], [b]) => a - b).map(([seasonNumber, seasonEpisodes]) => (
                    <AccordionItem key={seasonNumber} value={`season-${seasonNumber}`}>
                        <AccordionTrigger className="text-lg hover:text-white/90">
                            სეზონი {seasonNumber}
                            <Badge variant="secondary" className="ml-2">
                                {seasonEpisodes.length} ეპიზოდი
                            </Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                {seasonEpisodes.map((episode) => {
                                    const isSelected = selectedEpisode?.id === episode.id;
                                    return (
                                        <div
                                            key={`${episode.season}-${episode.episode}`}
                                            className={`flex items-start space-x-4 p-2 rounded-lg transition-colors cursor-pointer
                                                ${isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
                                            onClick={() => onEpisodeSelect?.(episode)}
                                        >
                                            <div className="flex-shrink-0 relative w-40 h-24">
                                                <Image
                                                    src={episode.poster_url || "/placeholder.svg"}
                                                    alt={`ეპიზოდი ${episode.episode}`}
                                                    fill
                                                    className="rounded-md object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                                                    <Play className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                                                        {episode.episode}. {episode.title}
                                                    </h3>
                                                    {isSelected && (
                                                        <Badge variant="secondary" className="bg-primary">
                                                            მიმდინარე
                                                        </Badge>
                                                    )}
                                                    {episode.is_available && (
                                                        <Badge variant="secondary" className="bg-green-600">
                                                            ხელმისაწვდომია
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    {episode.runtime && <span>{episode.runtime} წთ</span>}
                                                    {episode.air_date && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                                                        </>
                                                    )}
                                                    {episode.vote_average > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span>შეფასება: {episode.vote_average.toFixed(1)}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {episode.overview && (
                                                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                                                        {episode.overview}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}