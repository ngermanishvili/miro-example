// components/movies/PlatformFilter.tsx - თანამედროვე სტრიმინგ პლატფორმების ფილტრი
"use client";

import React from 'react';
import Image from 'next/image';

interface StreamingPlatform {
    id: string;
    name: string;
    logoPath: string;
}

interface PlatformFilterProps {
    selectedPlatform: string;
    onPlatformChange: (platform: string) => void;
}

const PlatformFilter: React.FC<PlatformFilterProps> = ({
    selectedPlatform,
    onPlatformChange
}) => {
    // პოპულარული სტრიმინგ პლატფორმები
    const streamingPlatforms: StreamingPlatform[] = [
        {
            id: 'netflix',
            name: 'Netflix',
            logoPath: '/assets/production-companies/netflix.png',
        },
        {
            id: 'amazon',
            name: 'Amazon Prime',
            logoPath: '/assets/production-companies/amazon.png',
        },
        {
            id: 'paramountplus',
            name: 'Paramount+',
            logoPath: '/assets/production-companies/prime-video.png',
        },
        {
            id: 'disney',
            name: 'Disney+',
            logoPath: '/assets/production-companies/disney.png',
        },
        {
            id: 'sonypictures',
            name: 'Sony Pictures',
            logoPath: '/assets/production-companies/disney.png',
        },
        {
            id: 'universal',
            name: 'Universal',
            logoPath: '/assets/production-companies/disney.png',
        }
    ];

    return (
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex justify-center items-center gap-4">
            <h3 className="text-xl font-semibold mb-4 text-white">სტრიმინგ პლატფორმები</h3>

            <div className="flex justify-center  items-center gap-4">
                {streamingPlatforms.map((platform) => (
                    <button
                        key={platform.id}
                        onClick={() => onPlatformChange(platform.id)}
                        className={`
              relative overflow-hidden rounded-lg shadow-md transition-all duration-300 
              ${selectedPlatform === platform.id
                                ? 'ring-2 ring-red-500 scale-105 z-10'
                                : 'hover:scale-102 hover:bg-gray-800'
                            }
              flex flex-col items-center justify-center p-3 bg-gray-800
            `}
                    >
                        <div className="relative w-12 h-12 mb-2">
                            <Image
                                src={platform.logoPath}
                                alt={platform.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-sm font-medium text-center">{platform.name}</span>

                        {selectedPlatform === platform.id && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlatformFilter;