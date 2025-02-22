"use client"
import React from 'react';

const Hero = () => {
    return (
        <div className="w-full flex justify-center">
            <section className="relative h-[80vh] w-full max-w-[800px] mt-[120px]">
                <iframe
                    className="absolute w-full h-full"
                    src="https://www.youtube.com/embed/h7lNAss_3VU?autoplay=1&mute=1&loop=1&playlist=h7lNAss_3VU"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                />
            </section>
        </div>
    );
};

export default Hero;