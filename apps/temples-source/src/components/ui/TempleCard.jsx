import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TempleCard({ id, name, location, image, description, onClick }) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onClick}
            className="group relative w-full aspect-[3/4] bg-surface-container-low rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-elevation-1 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] border border-white/10 hover:border-tertiary/40 transition-all duration-500"
        >
            {/* Image Container */}
            <div className="h-[60%] w-full overflow-hidden relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {/* Floating Location Tag */}
                <div className="absolute top-3 left-3 glass-panel border-white/20 rounded-full px-2 py-1 flex items-center gap-1 text-white/90 shadow-md">
                    <MapPin size={10} className="text-tertiary" />
                    <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-wider">{location}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 md:p-5 flex flex-col justify-between h-[40%] relative">
                <div>
                    <h3 className="font-decorative text-base sm:text-lg md:text-xl text-surface-foreground leading-tight mb-1 group-hover:text-tertiary transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-surface-on-variant text-xs md:text-sm line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] md:text-xs font-bold text-outline-variant group-hover:text-tertiary uppercase tracking-wider transition-colors">Explore</span>
                    <motion.div
                        whileHover={{ x: 3 }}
                        className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-tertiary group-hover:text-surface-foreground transition-colors shadow-sm"
                    >
                        <ArrowRight size={14} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
