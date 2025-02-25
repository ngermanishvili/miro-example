"use client";

import { useState } from 'react';
import TVShowsMainPage from '@/components/tv-series/tv-series-company';
import ContentTypeSwitcher, { ContentType } from './ContentTypeSwitcher';
import MoviesMainPage from '@/components/movies/movies-company';

export default function ContentPage() {
    const [contentType, setContentType] = useState<ContentType>("movies");

    return (
        <div className="min-h-screen bg-black text-white">
            <ContentTypeSwitcher onTypeChange={setContentType} initialType={contentType} />

            {contentType === "movies" ? (
                <MoviesMainPage />
            ) : (
                <TVShowsMainPage />
            )}
        </div>
    );
}