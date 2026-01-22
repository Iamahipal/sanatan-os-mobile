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
                "group flex flex-col items-center justify-center flex-1 py-3 transition-colors",
                isActive ? "text-primary font-medium" : "text-surface-on-variant"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 mb-1",
                    isActive ? "bg-secondary-container" : "group-active:bg-surface-variant"
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
            <span className="text-[10px] tracking-wide">{label}</span>
        </Link>
    );
};

export default function BottomBar() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant z-50 safe-area-bottom">
            <div className="flex items-center justify-between px-2 h-20">
                <NavItem
                    icon={Home}
                    label="Home"
                    to="/"
                />
                <NavItem
                    icon={Search}
                    label="Temples"
                    to="/temples"
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
        </nav>
    );
}
