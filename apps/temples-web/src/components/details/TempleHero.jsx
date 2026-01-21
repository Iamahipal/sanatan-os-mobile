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
                    src={temple.hero_image}
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-white/80 mb-4"
                >
                    <MapPin size={18} />
                    <span className="uppercase tracking-widest text-sm font-medium">{temple.location.city}, {temple.location.state}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-none mb-6 drop-shadow-lg"
                >
                    {temple.name}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4"
                >
                    <button
                        onClick={() => togglePlay(mantraTrack)}
                        className={`group flex items-center gap-3 px-6 py-4 rounded-full shadow-elevation-3 transition-all active:scale-95 ${isCurrentTrackPlaying
                                ? 'bg-primary-container text-primary-on-container ring-2 ring-primary'
                                : 'bg-primary text-primary-foreground hover:shadow-elevation-4 hover:scale-105'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentTrackPlaying ? 'bg-primary/20' : 'bg-white/20'}`}>
                            {isCurrentTrackPlaying ? (
                                <Pause size={16} fill="currentColor" />
                            ) : (
                                <Play size={16} fill="currentColor" />
                            )}
                        </div>
                        <span className="font-medium tracking-wide">
                            {isCurrentTrackPlaying ? 'Pause Chant' : 'Listen to Chant'}
                        </span>
                        {isCurrentTrackPlaying && (
                            <div className="flex items-end gap-1 h-4 ml-2 pb-1">
                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-current rounded-full" />
                                <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.1 }} className="w-1 bg-current rounded-full" />
                                <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }} className="w-1 bg-current rounded-full" />
                            </div>
                        )}
                    </button>

                    <button className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors uppercase tracking-widest text-xs font-bold">
                        Virtual Darshan
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
