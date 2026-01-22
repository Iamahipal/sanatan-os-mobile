import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Menu } from 'lucide-react';
import { cn } from '../../utils/cn';

const NavItem = ({ icon: Icon, label, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    return (
        <Link
            to={to}
            className={cn(
                "group flex flex-col items-center gap-1 p-2 w-full transition-colors",
                isActive ? "text-primary font-medium" : "text-surface-on-variant hover:text-primary"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300",
                    isActive ? "bg-secondary-container" : "group-hover:bg-surface-variant"
                )}
            >
                <Icon
                    size={24}
                    className={cn(
                        "transition-colors",
                        isActive ? "text-secondary-on-container" : "text-surface-on-variant"
                    )}
                />
            </div>
            <span className="text-xs tracking-wide">{label}</span>
        </Link>
    );
};

export default function NavigationRail() {
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
                        to="/"
                    />
                    <NavItem
                        icon={Search}
                        label="Temples"
                        to="/temples" // Or just '/' if search is on home page
                    />
                    <NavItem
                        icon={Heart}
                        label="Saved"
                        to="/saved"
                    />
                    <NavItem
                        icon={Menu}
                        label="More"
                        to="/more"
                    />
                </div>
            </div>
        </nav>
    );
}
