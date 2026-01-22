import React from 'react';
import { Home, Search, Heart, Menu } from 'lucide-react';
import { cn } from '../../utils/cn';

const NavItem = ({ icon: Icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group flex flex-col items-center justify-center flex-1 py-3 transition-colors",
                active ? "text-primary font-medium" : "text-surface-on-variant"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 mb-1",
                    active ? "bg-secondary-container" : "group-active:bg-surface-variant"
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
            <span className="text-[10px] tracking-wide">{label}</span>
        </button>
    );
};

export default function BottomBar({ activeTab, onTabChange }) {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant z-50 safe-area-bottom">
            <div className="flex items-center justify-between px-2 h-20">
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
        </nav>
    );
}
