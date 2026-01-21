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
            className="group relative flex-shrink-0 w-[320px] md:w-[360px] h-[480px] md:h-[520px] bg-surface-container-low rounded-[32px] overflow-hidden cursor-pointer shadow-elevation-1 hover:shadow-elevation-4 border border-outline-variant/20"
        >
            {/* Image Container - Taller Aspect Ratio */}
            <div className="h-[65%] w-full overflow-hidden relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Floating Location Tag */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5 text-white/90">
                    <MapPin size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">{location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-between h-[35%] relative">
                {/* Decorative Element */}
                <div className="absolute top-0 right-8 w-12 h-1 bg-primary rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-1"></div>

                <div>
                    <h3 className="font-serif text-3xl text-surface-foreground leading-none mb-3 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-surface-on-variant text-sm line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold text-outline-variant group-hover:text-primary uppercase tracking-widest transition-colors">Explore Sanctuary</span>
                    <motion.div
                        whileHover={{ x: 5 }}
                        className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors"
                    >
                        <ArrowRight size={18} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
