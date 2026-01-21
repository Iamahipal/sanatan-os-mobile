import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Moon, Clock, Map } from 'lucide-react';

const Section = ({ id, title, icon: Icon, children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

    return (
        <section id={id} ref={ref} className="scroll-mt-32 mb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-secondary-container text-secondary-on-container">
                    <Icon size={24} />
                </div>
                <h2 className="font-decorative text-3xl md:text-4xl text-surface-foreground tracking-wide">{title}</h2>
            </div>
            <div className="pl-4 md:pl-16 border-l-2 border-outline-variant/30">
                {children}
            </div>
        </section>
    );
};

export default function TempleContent({ temple, details }) {
    if (!details) return null;
    const { deity, manifest, facts, rituals } = details;

    // Helper to get stats safely
    const stats = manifest?.stats || {};
    const jyotirlingaNum = manifest?.significance?.jyotirlinga_number || "•";

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">

            {/* Overview Section */}
            <Section id="overview" title={manifest?.name || temple.name} icon={Sparkles}>
                <p className="text-xl leading-relaxed text-surface-on-variant mb-8 font-light">
                    {manifest?.description || temple.description}
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-surface-container rounded-2xl">
                        <div className="text-4xl font-serif text-primary mb-2">
                            {jyotirlingaNum}
                            <span className="text-base align-super opacity-60">st</span>
                        </div>
                        <div className="text-sm uppercase tracking-wider font-bold opacity-70">Jyotirlinga</div>
                    </div>
                    {stats.reconstructions && (
                        <div className="p-6 bg-surface-container rounded-2xl">
                            <div className="text-4xl font-serif text-primary mb-2">{stats.reconstructions}</div>
                            <div className="text-sm uppercase tracking-wider font-bold opacity-70">Reconstructions</div>
                        </div>
                    )}
                    {(stats.age_years || stats.altitude_feet) && (
                        <div className="p-6 bg-surface-container rounded-2xl">
                            <div className="text-4xl font-serif text-primary mb-2">
                                {stats.age_years ? `${stats.age_years}+` : stats.altitude_feet}
                            </div>
                            <div className="text-sm uppercase tracking-wider font-bold opacity-70">
                                {stats.age_years ? 'Years Old' : 'Feet Altitude'}
                            </div>
                        </div>
                    )}
                </div>
            </Section>

            {/* Deity Section */}
            {deity && (
                <Section id="deity" title={deity.name} icon={Moon}>
                    <div className="prose prose-lg prose-p:text-surface-on-variant prose-headings:font-serif">
                        <h3>{deity.meaning || `The Form of ${deity.primary}`}</h3>
                        <p>{deity.mythology?.origin_story}</p>

                        {deity.mythology?.quote && (
                            <blockquote>{deity.mythology.quote}</blockquote>
                        )}

                        {/* Fallback to iconography if no quote */}
                        {!deity.mythology?.quote && deity.iconography?.form_here && (
                            <p className="italic mt-4 border-l-4 border-primary pl-4">{deity.iconography.form_here}</p>
                        )}
                    </div>
                </Section>
            )}

            {/* Rituals Section */}
            <Section id="rituals" title="Sacred Rituals" icon={Clock}>
                <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/50">
                    {rituals ? (
                        <ul className="space-y-6">
                            {rituals.daily_schedule && rituals.daily_schedule.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center pb-4 border-b border-outline-variant/20 last:border-0 last:pb-0">
                                    <span className="font-medium font-serif text-lg">{item.name || item.event}</span>
                                    <span className="font-bold text-tertiary font-sans tracking-wide">{item.time}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-surface-on-variant">
                                {deity?.worship?.festivals?.map(f => f.name).join(", ") || "Daily worship is performed according to Vedic traditions."}
                            </p>
                            {deity?.worship?.primary_mantra && (
                                <div className="p-6 bg-surface-container rounded-xl border border-primary/10">
                                    <p className="font-sanskrit text-2xl text-primary text-center mb-2 leading-relaxed">"{deity.worship.primary_mantra.transliteration}"</p>
                                    <p className="text-center text-sm opacity-70 italic font-serif">{deity.worship.primary_mantra.translation}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Section>

            {/* Guide Section */}
            <Section id="guide" title="Pilgrim's Guide" icon={Map}>
                <p className="text-lg text-surface-on-variant mb-6">
                    {manifest?.location?.sacred_geography || temple.location.city}
                </p>
                <div className="mb-6 p-4 bg-secondary-container/20 rounded-lg">
                    <h4 className="font-bold mb-2">How to Reach</h4>
                    <p className="text-sm opacity-80">{manifest?.location?.access}</p>
                </div>
                <button className="px-8 py-3 bg-secondary-container text-secondary-on-container rounded-full font-medium hover:bg-secondary/20 transition-colors">
                    Get Directions
                </button>
            </Section>

        </div>
    );
}
