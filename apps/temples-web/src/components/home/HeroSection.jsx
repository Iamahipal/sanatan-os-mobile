import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../ui/SearchBar';

export default function HeroSection() {
    return (
        <div className="relative h-[80vh] w-full overflow-hidden rounded-b-3xl md:rounded-b-[48px] shadow-elevation-2">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/data/temples/somnath/images/hero.png"
                    alt="Divine Journey"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex flex-col items-center justify-center px-4 md:px-8 text-center z-10">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium uppercase tracking-widest mb-6"
                >
                    Sanatan Yatra
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-6 drop-shadow-md"
                >
                    Discover the <span className="text-secondary-container">Divine</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90 text-lg md:text-xl max-w-2xl mb-10 font-light"
                >
                    Embark on a spiritual journey through the most sacred temples of India.
                    Experience the peace, history, and ancient wisdom.
                </motion.p>

                <div className="w-full max-w-lg">
                    <SearchBar />
                </div>
            </div>
        </div>
    );
}
