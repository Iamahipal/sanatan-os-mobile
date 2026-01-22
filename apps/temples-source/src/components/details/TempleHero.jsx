import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Play, Pause, Music2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export default function TempleHero({ temple }) {
    const { scrollY } = useScroll();
    const { isPlaying, currentTrack, togglePlay } = useAudio();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Define the track here or get it from props.
    // For now, hardcode a placeholder since we don't have temple.mantra_url yet.
    // In a real app, this comes from the JSON.
    const mantraTrack = {
        url: temple.mantra_url || '/audio/om_namah_shivaya.mp3', // Future proofing
        title: `${temple.name} Chant`,
        subtitle: 'Om Namah Shivaya',
    };

    const isCurrentTrackPlaying = isPlaying && currentTrack?.url === mantraTrack.url;

    return (
        <div className="relative h-[80vh] w-full overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 h-[120%]"
            >
                <img
                    src={temple.hero_image?.startsWith('http') || temple.hero_image?.startsWith('/')
                        ? temple.hero_image
                        : `/${temple.hero_image}`}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-12 max-w-7xl mx-auto"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative flex items-center gap-3 text-white/90 mb-4 ml-1"
                >
                    <MapPin size={16} className="text-tertiary" />
                    <span className="uppercase tracking-[0.2em] text-xs font-bold font-sans">{temple.location.city}, {temple.location.state}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative font-decorative text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white mb-6 md:mb-8 drop-shadow-2xl leading-[0.9]"
                >
                    {temple.name}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative flex flex-row flex-wrap gap-3 md:gap-4"
                >
                    <button
                        onClick={() => togglePlay(mantraTrack)}
                        className={`group flex items-center gap-2 md:gap-3 px-5 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 ${isCurrentTrackPlaying
                            ? 'bg-tertiary text-surface-foreground ring-2 ring-white/50 shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                            : 'bg-white text-surface-foreground hover:bg-tertiary hover:scale-105 shadow-xl'
                            }`}
                    >
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors ${isCurrentTrackPlaying ? 'bg-black/10' : 'bg-surface-variant'}`}>
                            {isCurrentTrackPlaying ? (
                                <Pause size={14} fill="currentColor" />
                            ) : (
                                <Play size={14} fill="currentColor" />
                            )}
                        </div>
                        <span className="font-bold tracking-wide text-xs md:text-sm uppercase">
                            {isCurrentTrackPlaying ? 'Pause' : 'Chant'}
                        </span>
                        {isCurrentTrackPlaying && (
                            <div className="flex items-end gap-1 h-3 md:h-4 ml-1 md:ml-2 pb-1">
                                <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 md:w-1 bg-current rounded-full" />
                                <motion.div animate={{ height: [3, 12, 3] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.1 }} className="w-0.5 md:w-1 bg-current rounded-full" />
                                <motion.div animate={{ height: [3, 6, 3] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }} className="w-0.5 md:w-1 bg-current rounded-full" />
                            </div>
                        )}
                    </button>

                    <button className="px-5 py-3 md:px-8 md:py-4 glass-panel border-white/20 hover:border-tertiary/50 text-white rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-[10px] md:text-xs font-bold shadow-lg">
                        Virtual Darshan
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
