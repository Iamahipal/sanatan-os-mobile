import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, X, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioDock() {
    const { isPlaying, currentTrack, togglePlay, closePlayer } = useAudio();

    if (!currentTrack) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6 pointer-events-none flex justify-center"
            >
                <div className="pointer-events-auto bg-surface-container-high/90 backdrop-blur-xl border border-white/10 text-surface-on-variant shadow-elevation-4 rounded-full p-2 pr-6 flex items-center gap-4 min-w-[320px] md:min-w-[400px]">

                    {/* Album Art / Icon */}
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse-slow">
                        <Music2 size={20} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 overflow-hidden">
                        <h4 className="font-serif font-bold text-surface-foreground truncate">{currentTrack.title}</h4>
                        <p className="text-xs text-secondary truncate">{currentTrack.subtitle}</p>
                    </div>

                    {/* Controls */}
                    <button
                        onClick={() => togglePlay(currentTrack)}
                        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-elevation-2"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>

                    <button
                        onClick={closePlayer}
                        className="p-2 hover:bg-surface-on/5 rounded-full text-surface-on-variant/50 hover:text-surface-on-variant transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
