import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SearchBar from '../ui/SearchBar';

export default function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={ref} className="relative h-[90vh] w-full overflow-hidden rounded-b-[40px] md:rounded-b-[64px] shadow-elevation-3 perspective-1000">
            {/* Parallax Background Image */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0 will-change-transform"
            >
                <img
                    src="/data/temples/somnath/images/hero.png"
                    alt="Divine Journey"
                    className="w-full h-full object-cover scale-110" // Initial scale to avoid gaps
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
            </motion.div>

            {/* Content Overlay with Parallax Text */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative h-full flex flex-col items-center justify-center px-4 md:px-8 text-center z-10"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-surface/20 to-transparent pointer-events-none" />

                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="inline-block py-2 px-6 rounded-full glass-panel border-tertiary/30 text-tertiary text-xs font-bold font-decorative tracking-[0.3em] uppercase mb-8 hover:bg-white/10 transition-colors cursor-default backdrop-blur-md"
                >
                    Sanatan Yatra
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                    className="font-decorative text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight drop-shadow-2xl"
                >
                    Discover the <span className="text-tertiary italic drop-shadow-lg">Divine</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-white/90 text-lg md:text-2xl max-w-3xl mb-12 font-serif italic leading-relaxed tracking-wide drop-shadow-md"
                >
                    Embark on a spiritual journey through the most sacred temples of India.
                    Experience the peace, history, and ancient wisdom.
                </motion.p>

                <div className="w-full max-w-xl will-change-transform">
                    <SearchBar />
                </div>
            </motion.div>
        </div>
    );
}
