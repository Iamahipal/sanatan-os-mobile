import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-surface-container-high py-16 text-surface-foreground border-t border-outline-variant/20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles size={24} />
                            <span className="font-decorative text-2xl font-bold tracking-wider">Sanatan Yatra</span>
                        </div>
                        <p className="font-serif text-lg text-surface-on-variant max-w-sm leading-relaxed">
                            A digital pilgrimage to the eternal abodes of Shiva. Discover the stories, rituals, and divine energy of the 12 Jyotirlingas.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold tracking-widest uppercase text-sm opacity-60">Explore</h4>
                        <ul className="space-y-3 font-serif">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/temples/somnath" className="hover:text-primary transition-colors">Somnath</Link></li>
                            <li><Link to="/temples/kashi-vishwanath" className="hover:text-primary transition-colors">Kashi Vishwanath</Link></li>
                            <li><Link to="/temples/kedarnath" className="hover:text-primary transition-colors">Kedarnath</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h4 className="font-bold tracking-widest uppercase text-sm opacity-60">Offerings</h4>
                        <ul className="space-y-3 font-serif">
                            <li><a href="#" className="hover:text-primary transition-colors">Virtual Darshan</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Light a Diya</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Donations</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm opacity-60">
                    <p>&copy; {new Date().getFullYear()} SanatanOS. All rights reserved.</p>
                    <div className="flex items-center gap-1 mt-4 md:mt-0 font-serif italic">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500 fill-current" />
                        <span>and Devotion</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
