import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedTemples from '../components/home/FeaturedTemples';

export default function Home() {
    return (
        <div className="bg-surface min-h-screen pb-20">
            <HeroSection />
            <FeaturedTemples />

            {/* Additional sections can be added here */}
            <div className="h-20" /> {/* Spacer */}
        </div>
    );
}
