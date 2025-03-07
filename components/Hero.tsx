"use client"
import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <>

            <div className="w-full flex justify-center mt-[50px]">
                <section className="relative h-[70vh] w-full max-w-[800px] mt-[120px]">
                    <Image
                        src="/assets/giphy-main-animation.gif" // Update this path to your actual GIF location
                        alt="Hero animation"
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="absolute w-full h-full"
                    />
                </section>
            </div>
            <span className='text-black text-2xl font-bold flex items-center justify-center py-4 '>We provide tailored architecture and design solutions, combining expertise, innovation, and seamless  <br />collaboration to bring your vision to life.</span>
        </>
    );
};

export default Hero;