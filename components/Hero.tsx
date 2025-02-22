"use client"
import React, { useState } from 'react';

const Hero = () => {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <div className="w-full flex justify-center">
            <section className="relative h-[80vh] w-full max-w-[800px] mt-[120px]">
                <iframe
                    className="absolute w-full h-full"
                    src={`https://www.youtube.com/embed/h7lNAss_3VU?autoplay=${isPlaying ? 1 : 0}&mute=1&loop=1&playlist=h7lNAss_3VU&controls=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                />
                <div
                    className="absolute inset-0 bg-black/20 z-10 cursor-pointer flex items-center justify-center"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {!isPlaying && (
                        <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
                        </div>
                    )}
                    {isPlaying && (
                        <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                            <div className="flex gap-2">
                                <div className="w-3 h-16 bg-white rounded" />
                                <div className="w-3 h-16 bg-white rounded" />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Hero;