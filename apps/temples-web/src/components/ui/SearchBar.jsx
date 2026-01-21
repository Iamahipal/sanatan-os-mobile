import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function SearchBar({ className, onSearch }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
                "relative flex items-center w-full max-w-lg mx-auto bg-surface-container-high rounded-full shadow-elevation-3 transition-all duration-300",
                isFocused ? "shadow-elevation-4 ring-2 ring-primary/20 scale-105" : "hover:shadow-elevation-4",
                className
            )}
        >
            <div className="pl-4 text-primary">
                <Search size={24} />
            </div>
            <input
                type="text"
                placeholder="Search for temples, deities..."
                className="w-full py-4 px-4 bg-transparent border-none outline-none text-surface-foreground placeholder:text-surface-on-variant/70 text-lg font-sans"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onSearch && onSearch(e.target.value)}
            />
        </motion.div>
    );
}
