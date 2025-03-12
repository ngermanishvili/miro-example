'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingAnimation = ({ onComplete }: { onComplete: () => void }) => {
    const text = "DRAFT WORK PROJECTS";
    const letters = Array.from(text);
    const [visibleLetters, setVisibleLetters] = useState<number>(0);

    useEffect(() => {
        // Display one letter at a time
        if (visibleLetters < letters.length) {
            const timer = setTimeout(() => {
                setVisibleLetters(prev => prev + 1);
            }, 180); // Adjust speed of letters appearing

            return () => clearTimeout(timer);
        } else {
            // Animation complete, transition to main content after a pause
            const timer = setTimeout(() => {
                onComplete();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [visibleLetters, letters.length, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
        >
            <div className="flex">
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        className={`text-5xl md:text-7xl font-bold ${letter === " " ? "mr-5" : "mr-1"
                            }`}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: index < visibleLetters ? 1 : 0,
                            y: index < visibleLetters ? 0 : 20
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
};

export default LoadingAnimation;