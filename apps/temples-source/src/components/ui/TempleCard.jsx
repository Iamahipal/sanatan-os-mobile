import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function TempleCard({ id, name, location, image, description, onClick }) {
    return (
        <motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onClick}
            className="group relative flex-shrink-0 w-[320px] md:w-[360px] h-[480px] md:h-[520px] bg-surface-container-low rounded-[32px] overflow-hidden cursor-pointer shadow-elevation-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] border border-white/10 hover:border-tertiary/40 transition-all duration-500"
        >
            {/* Image Container - Taller Aspect Ratio */}
            <div className="h-[65%] w-full overflow-hidden relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {/* Floating Location Tag */}
                <div className="absolute top-4 left-4 glass-panel border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5 text-white/90 shadow-md">
                    <MapPin size={12} className="text-tertiary" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">{location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-between h-[35%] relative">
                {/* Decorative Element */}
                <div className="absolute top-0 right-8 w-12 h-1 bg-tertiary rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-1 shadow-[0_4px_12px_rgba(212,175,55,0.4)]"></div>

                <div>
                    <h3 className="font-decorative text-3xl text-surface-foreground leading-none mb-3 group-hover:text-tertiary transition-colors">
                        {name}
                    </h3>
                    <p className="text-surface-on-variant text-sm line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity font-serif">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold text-outline-variant group-hover:text-tertiary uppercase tracking-widest transition-colors font-sans">Explore Sanctuary</span>
                    <motion.div
                        whileHover={{ x: 5 }}
                        className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-tertiary group-hover:text-surface-foreground transition-colors shadow-sm"
                    >
                        <ArrowRight size={18} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
