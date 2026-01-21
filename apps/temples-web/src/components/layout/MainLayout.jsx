import React, { useState } from 'react';
import NavigationRail from './NavigationRail';
import BottomBar from './BottomBar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-surface flex flex-col md:flex-row">
            {/* Desktop Navigation */}
            <NavigationRail activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 w-full md:pl-20 pb-20 md:pb-0 transition-all duration-300">
                <div className="w-full h-full max-w-7xl mx-auto">
                    {/* 
                We use Outlet for routing content. 
                For now, creating a temporary placeholder for HomeContent until we wire up Router 
            */}
                    <Outlet context={{ activeTab }} />
                </div>
            </main>

            {/* Mobile Navigation */}
            <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}
