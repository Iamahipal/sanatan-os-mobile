import React from 'react';
import TempleCard from '../ui/TempleCard';
import { useTemples } from '../../hooks/useTemples';
import { motion } from 'framer-motion';

export default function FeaturedTemples() {
    const { temples, loading } = useTemples();

    // Loading Skeleton
    if (loading) {
        return (
            <section className="py-20 px-6 max-w-[1920px] mx-auto opacity-50">
                <div className="flex gap-8 overflow-hidden">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex-shrink-0 w-80 h-[480px] bg-surface-variant/30 rounded-3xl" />
                    ))}
                </div>
            </section>
        );
    }

    // Animation Variants for Staggered "Tile" Entry
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    return (
        <section className="py-24 md:py-32 bg-surface">
            <div className="container mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
                <div>
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block"
                    >
                        Sacred Destinations
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-5xl text-surface-foreground"
                    >
                        Featured Temples
                    </motion.h2>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="hidden md:block text-outline hover:text-primary font-medium text-sm tracking-wide transition-colors pb-1 border-b border-transparent hover:border-primary"
                >
                    View All Destinations
                </motion.button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
            >
                {/* Scroll Container with "Tile" feel */}
                <div className="flex gap-6 md:gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x snap-mandatory scrollbar-hide pt-4">
                    {temples.map((temple) => (
                        <motion.div
                            key={temple.id}
                            variants={itemVariants}
                            className="snap-center pt-2"
                        >
                            <TempleCard
                                {...temple}
                                onClick={() => console.log('Navigate to:', temple.id)}
                            />
                        </motion.div>
                    ))}
                    {/* Spacer for right scrolling */}
                    <div className="w-6 md:w-12 flex-shrink-0" />
                </div>
            </motion.div>
        </section>
    );
}
