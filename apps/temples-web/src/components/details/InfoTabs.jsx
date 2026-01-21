import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deity', label: 'Deity' },
    { id: 'rituals', label: 'Rituals' },
    { id: 'guide', label: 'Guide' },
];

export default function InfoTabs({ activeTab, onTabChange }) {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = window.innerHeight * 0.8;
            setIsSticky(window.scrollY > heroHeight - 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={cn(
            "sticky top-0 z-40 w-full transition-all duration-300 border-b border-outline-variant/20",
            isSticky ? "bg-surface/90 backdrop-blur-lg shadow-elevation-1 py-2" : "bg-surface py-4"
        )}>
            <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                onTabChange(tab.id);
                                document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={cn(
                                "relative px-6 py-3 rounded-full text-sm font-medium transition-colors",
                                activeTab === tab.id ? "text-primary" : "text-surface-on-variant hover:text-surface-foreground"
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-secondary-container rounded-full lg:rounded-2xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
