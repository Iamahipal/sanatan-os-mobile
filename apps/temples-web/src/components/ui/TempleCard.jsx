import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function TempleCard({ id, name, location, image, description, onClick }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className="group relative flex-shrink-0 w-80 h-[420px] bg-surface-container-low rounded-3xl overflow-hidden cursor-pointer shadow-elevation-1 hover:shadow-elevation-4 border border-outline-variant/30"
        >
            {/* Image Container */}
            <div className="h-3/5 w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between h-2/5">
                <div>
                    <div className="flex items-center gap-1.5 text-primary mb-2 opacity-90">
                        <MapPin size={14} />
                        <span className="text-xs font-medium tracking-wide uppercase">{location}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-surface-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-surface-on-variant text-sm line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Explore</span>
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary transition-transform group-hover:bg-primary group-hover:text-surface group-hover:translate-x-1">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
