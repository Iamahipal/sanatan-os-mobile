import React from 'react';
import TempleCard from '../ui/TempleCard';
import { useTemples } from '../../hooks/useTemples';
import { motion } from 'framer-motion';

export default function FeaturedTemples() {
    const { temples, loading } = useTemples();

    if (loading) {
        return (
            <div className="py-12 px-6 flex gap-6 overflow-x-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex-shrink-0 w-80 h-[420px] bg-surface-variant animate-pulse rounded-3xl" />
                ))}
            </div>
        );
    }

    return (
        <section className="py-12 md:py-16">
            <div className="flex items-center justify-between px-6 mb-8">
                <h2 className="font-serif text-3xl text-surface-foreground">Featured Temples</h2>
                <button className="text-primary font-medium text-sm hover:underline">View All</button>
            </div>

            <div className="relative">
                {/* Scroll Container */}
                <div className="flex gap-6 overflow-x-auto pb-8 px-6 snap-x snap-mandatory scrollbar-hide">
                    {temples.map((temple, index) => (
                        <motion.div
                            key={temple.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="snap-center"
                        >
                            <TempleCard
                                {...temple}
                                onClick={() => console.log('Navigate to:', temple.id)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Fade overlay for scroll indication */}
                <div className="absolute right-0 top-0 bottom-8 w-16 bg-gradient-to-l from-surface to-transparent pointer-events-none md:hidden" />
            </div>
        </section>
    );
}
