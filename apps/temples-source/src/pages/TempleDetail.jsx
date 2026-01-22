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
    const [details, setDetails] = useState({
        deity: null,
        manifest: null,
        facts: [],
        rituals: null,
        loading: true
    });
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (temples.length > 0) {
            const found = temples.find(t => t.id === id);
            if (found) {
                setTemple(found);

                const fetchData = async () => {
                    const baseUrl = import.meta.env.BASE_URL;
                    try {
                        // Fetch core data files with correct BASE_URL
                        const [deityRes, manifestRes, factsRes] = await Promise.all([
                            fetch(`${baseUrl}data/temples/${id}/deity.json`).then(r => r.ok ? r.json() : null),
                            fetch(`${baseUrl}data/temples/${id}/manifest.json`).then(r => r.ok ? r.json() : null),
                            fetch(`${baseUrl}data/temples/${id}/facts.json`).then(r => r.ok ? r.json() : [])
                        ]);

                        // Try to fetch rituals if exists
                        let ritualsRes = null;
                        try {
                            const r = await fetch(`${baseUrl}data/temples/${id}/rituals.json`);
                            if (r.ok) ritualsRes = await r.json();
                        } catch (e) { }

                        setDetails({
                            deity: deityRes,
                            manifest: manifestRes,
                            facts: factsRes || [],
                            rituals: ritualsRes,
                            loading: false
                        });
                    } catch (error) {
                        console.error("Failed to load details", error);
                        setDetails(prev => ({ ...prev, loading: false }));
                    }
                };
                fetchData();
            }
        }
    }, [id, temples]);

    // Handle Tab Scroll Logic
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        const element = document.getElementById(tabId);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    if (loading || !temple) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // Merge basic index data with detailed manifest data key
    const mergedTemple = { ...temple, ...(details.manifest || {}) };

    return (
        <div className="bg-surface min-h-screen pb-20">
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full glass-panel border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-105 shadow-xl"
            >
                <ArrowLeft size={24} />
            </button>

            <TempleHero temple={mergedTemple} />

            <InfoTabs activeTab={activeTab} onTabChange={handleTabChange} />

            <TempleContent temple={mergedTemple} details={details} />
        </div>
    );
}
