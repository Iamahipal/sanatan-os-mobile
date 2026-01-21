import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTemples } from '../hooks/useTemples';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import TempleHero from '../components/details/TempleHero';
import InfoTabs from '../components/details/InfoTabs';
import TempleContent from '../components/details/TempleContent';

export default function TempleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { temples, loading } = useTemples();
    const [temple, setTemple] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (temples.length > 0) {
            const found = temples.find(t => t.id === id);
            if (found) {
                setTemple(found);
            }
        }
    }, [id, temples]);

    // Handle Tab Scroll Logic
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        // Determine offset based on layout (hero height + sticky header)
        // Done in component via scrollIntoView, but state tracks active
    };

    if (loading || !temple) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen pb-20">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all hover:scale-105"
            >
                <ArrowLeft size={24} />
            </button>

            <TempleHero temple={temple} onPlayChant={() => console.log('Play')} />

            <InfoTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <TempleContent temple={temple} />
        </div>
    );
}
