import React from 'react';
import { useNavigate } from 'react-router-dom';
import TempleCard from '../ui/TempleCard';
import { useTemples } from '../../hooks/useTemples';
import { motion } from 'framer-motion';

export default function FeaturedTemples() {
    const { temples, loading } = useTemples();
    const navigate = useNavigate();

    // Loading Skeleton - Grid version
    if (loading) {
        return (
            <section className="py-12 md:py-20 px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[3/4] bg-surface-variant/30 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    // Animation Variants for Staggered Grid Entry
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 20 }
        }
    };

    return (
        <section className="py-12 md:py-20 bg-surface">
            {/* Section Header */}
            <div className="container mx-auto px-4 md:px-8 mb-8 md:mb-12">
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block"
                >
                    12 Jyotirlingas
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-decorative text-2xl md:text-4xl text-surface-foreground"
                >
                    Sacred Temples
                </motion.h2>
            </div>

            {/* Tile Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="container mx-auto px-4 md:px-8"
            >
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {temples.map((temple) => (
                        <motion.div
                            key={temple.id}
                            variants={itemVariants}
                        >
                            <TempleCard
                                {...temple}
                                onClick={() => navigate(`/temples/${temple.id}`)}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
