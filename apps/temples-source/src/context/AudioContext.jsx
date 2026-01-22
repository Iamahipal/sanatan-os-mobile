import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null); // { url, title, subtitle }
    const audioRef = useRef(new Audio());

    const togglePlay = (track) => {
        if (currentTrack?.url === track.url) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            if (currentTrack) {
                audioRef.current.pause();
            }
            audioRef.current.src = track.url;
            audioRef.current.play().catch(e => console.warn("Audio playback failed:", e));
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const closePlayer = () => {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTrack(null);
    }

    // Effect to handle audio events if needed (ended, error)
    useEffect(() => {
        const audio = audioRef.current;
        const onEnded = () => setIsPlaying(false);
        // Loop? Mantra usually loops.
        audio.loop = true;

        audio.addEventListener('ended', onEnded);
        return () => audio.removeEventListener('ended', onEnded);
    }, []);

    return (
        <AudioContext.Provider value={{ isPlaying, currentTrack, togglePlay, closePlayer }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    return useContext(AudioContext);
}
