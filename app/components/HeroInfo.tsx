// HeroInfo.tsx
import Image from "next/image";
import { PlayCircle, InfoIcon } from "lucide-react";

interface HeroInfoProps {
    title_eng: string;
    title_geo: string;
    description_eng: string | null;
    description_geo: string | null;
    logoPath?: string | null;
    releaseYear?: string | null;
    imdbRating?: string | null;
}

const HeroInfo: React.FC<HeroInfoProps> = ({
    title_eng,
    title_geo,
    description_eng,
    description_geo,
    logoPath,
    releaseYear,
    imdbRating,
}) => {
    return (
        <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-[1200px] h-full flex items-center pl-4 sm:pl-8 md:pl-12 lg:pl-[40px]">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-black from-40% via-black/15 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 md:space-y-6">
                {/* Logo */}
                <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
                    <Image
                        src="https://occ-0-5515-2774.1.nflxso.net/dnm/api/v6/tx1O544a9T7n8Z_G12qaboulQQE/AAAABdDTBe3mBUv6PaCHy7OQnSIGuMO1aKcWT556KF3NbjffWXaUBDtQuDf5bNTOUqV8qBePJHXH-DBqeCToe4eI1ngW_GVMyguJblkhR2RbgKtge1xZ7Map6rv7GDY7oPXA_utYFIy1sgdoM4IO7DoY71NMeHb5ChTmhJ-oorIuAYhXU3wmhoUMbA.png?r=0b2"
                        alt="SAKAMOTO DAYS"
                        width={600}
                        height={300}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Info */}
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center flex-wrap gap-2 text-sm sm:text-base text-gray-300">
                        <span className="font-semibold">2025</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="border border-gray-300 px-1 py-0.5 text-xs">
                            16+
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>1 Season</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>Anime</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg max-w-[90%] sm:max-w-md text-gray-100 drop-shadow-md">
                    Once the greatest hitman of all, Taro Sakamoto retired in the name of love. But when his past catches up, he must fight to protect his beloved family.
                </p>

                {/* Cast */}
                <div className="text-sm sm:text-base text-gray-300">
                    <span className="text-gray-400">Starring:</span> Tomokazu Sugita, Nobunaga Shimazaki, Ayane Sakura
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                    <button className="flex items-center bg-white text-black py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-6 rounded-md hover:bg-gray-200 transition duration-300 font-medium text-sm sm:text-base">
                        <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        Play
                    </button>
                    <button className="flex items-center bg-gray-500/70 text-white py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-6 rounded-md hover:bg-gray-600 transition duration-300 font-medium text-sm sm:text-base">
                        <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                        More Info
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroInfo;