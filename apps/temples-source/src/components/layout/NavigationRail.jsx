import React from 'react';
import { Home, Search, Heart, Menu } from 'lucide-react';
import { cn } from '../../utils/cn';

const NavItem = ({ icon: Icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group flex flex-col items-center gap-1 p-2 w-full transition-colors",
                active ? "text-primary font-medium" : "text-surface-on-variant hover:text-primary"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300",
                    active ? "bg-secondary-container" : "group-hover:bg-surface-variant"
                )}
            >
                <Icon
                    size={24}
                    className={cn(
                        "transition-colors",
                        active ? "text-secondary-on-container" : "text-surface-on-variant"
                    )}
                />
            </div>
            <span className="text-xs tracking-wide">{label}</span>
        </button>
    );
};

export default function NavigationRail({ activeTab, onTabChange }) {
    return (
        <nav className="hidden md:flex flex-col w-20 h-full bg-surface-container-low border-r border-outline-variant py-8 fixed left-0 top-0 z-50">
            <div className="flex flex-col gap-8 items-center w-full">
                {/* FAB Placeholder or Logo */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🕉️</span>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <NavItem
                        icon={Home}
                        label="Home"
                        active={activeTab === 'home'}
                        onClick={() => onTabChange('home')}
                    />
                    <NavItem
                        icon={Search}
                        label="Temples"
                        active={activeTab === 'search'}
                        onClick={() => onTabChange('search')}
                    />
                    <NavItem
                        icon={Heart}
                        label="Saved"
                        active={activeTab === 'saved'}
                        onClick={() => onTabChange('saved')}
                    />
                    <NavItem
                        icon={Menu}
                        label="More"
                        active={activeTab === 'more'}
                        onClick={() => onTabChange('more')}
                    />
                </div>
            </div>
        </nav>
    );
}
