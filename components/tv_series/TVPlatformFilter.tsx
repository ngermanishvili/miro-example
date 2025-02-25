// components/tv-series/TVPlatformFilter.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface StreamingPlatform {
    id: string;
    name: string;
    logoPath: string;
}

interface Platform {
    platform_id: string;
    platform_name: string;
    display_name: string;
    series_count: number;
}

interface TVPlatformFilterProps {
    selectedPlatform: string;
    onPlatformChange: (platform: string) => void;
}

const TVPlatformFilter: React.FC<TVPlatformFilterProps> = ({
    selectedPlatform,
    onPlatformChange
}) => {
    const [apiPlatforms, setApiPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(true);

    // API-დან პლატფორმების მიღება
    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/tv-platforms');

                if (response.ok) {
                    const data = await response.json();
                    setApiPlatforms(data.platforms || []);
                } else {
                    console.error('პლატფორმების ჩატვირთვის შეცდომა:', response.statusText);
                    setApiPlatforms([]);
                }
            } catch (error) {
                console.error('პლატფორმების ჩატვირთვის შეცდომა:', error);
                setApiPlatforms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlatforms();
    }, []);

    // ფიქსირებული სტრიმინგ პლატფორმები სათადარიგოდ
    const defaultPlatforms: StreamingPlatform[] = [
        {
            id: 'netflix',
            name: 'Netflix',
            logoPath: '/assets/platforms/netflix.png',
        },
        {
            id: 'amazon',
            name: 'Amazon Prime',
            logoPath: '/assets/platforms/amazon.png',
        },
        {
            id: 'hbo',
            name: 'HBO Max',
            logoPath: '/assets/platforms/hbo.png',
        },
        {
            id: 'disneyplus',
            name: 'Disney+',
            logoPath: '/assets/platforms/disney.png',
        },
        {
            id: 'paramount',
            name: 'Paramount+',
            logoPath: '/assets/platforms/paramount.png',
        },
        {
            id: 'appletv',
            name: 'Apple TV+',
            logoPath: '/assets/platforms/appletv.png',
        }
    ];

    // API-დან მიღებული ან ფიქსირებული პლატფორმების გამოყენება
    const streamingPlatforms = apiPlatforms.length > 0
        ? apiPlatforms.map(p => ({
            id: p.platform_id,
            name: p.display_name,
            logoPath: `/assets/platforms/${p.platform_id}.png`, // ლოგოების გზა
        }))
        : defaultPlatforms;

    // ჩატვირთვის მდგომარეობა
    if (loading) {
        return (
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">სტრიმინგ პლატფორმები</h3>
                <div className="flex justify-center items-center gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-24 h-24 bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">სტრიმინგ პლატფორმები</h3>

            <div className="flex flex-wrap justify-center items-center gap-4">
                {streamingPlatforms.map((platform) => (
                    <button
                        key={platform.id}
                        onClick={() => onPlatformChange(platform.id)}
                        className={`
                            relative overflow-hidden rounded-lg shadow-md transition-all duration-300
                            ${selectedPlatform === platform.id
                                ? 'ring-2 ring-purple-500 scale-105 z-10'
                                : 'hover:scale-105 hover:bg-gray-700'
                            }
                            flex flex-col items-center justify-center p-3 bg-gray-800
                            w-24 h-24
                        `}
                    >
                        <div className="relative w-12 h-12 mb-2">
                            <Image
                                src={platform.logoPath}
                                alt={platform.name}
                                fill
                                className="object-contain"
                                onError={(e) => {
                                    // შეცდომის შემთხვევაში ჩანაცვლება სტანდარტული ლოგოთი
                                    (e.target as HTMLImageElement).src = '/assets/placeholder-logo.png';
                                }}
                            />
                        </div>
                        <span className="text-xs font-medium text-center line-clamp-2">{platform.name}</span>

                        {selectedPlatform === platform.id && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TVPlatformFilter;