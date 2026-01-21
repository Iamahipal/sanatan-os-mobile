/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#B94E00', // Richer Deep Saffron
                    foreground: '#FFFFFF',
                    container: '#FFDCB8',
                    'on-container': '#321300',
                },
                secondary: {
                    DEFAULT: '#755945',
                    foreground: '#FFFFFF',
                    container: '#FFDCC5',
                    'on-container': '#2B1708',
                },
                tertiary: {
                    DEFAULT: '#D4AF37', // Divine Gold
                    foreground: '#211A14',
                },
                surface: {
                    DEFAULT: '#FFF8F5', // Off-white cream
                    foreground: '#211A14',
                    variant: '#F3DFD2',
                    'on-variant': '#51443B',
                    container: '#F8ECE3', // Warm sand
                    'container-low': '#FEF1E9',
                    'container-high': '#F2E6DD',
                },
                outline: {
                    DEFAULT: '#847469',
                    variant: '#D6C3B6',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['"Outfit"', 'sans-serif'],
                decorative: ['"Cinzel Decorative"', 'serif'],
                sanskrit: ['"Tiro Devanagari Sanskrit"', 'serif'],
            },
            borderRadius: {
                'lg': '16px',
                'xl': '24px',
                '2xl': '32px',
                '3xl': '48px',
            },
            boxShadow: {
                'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px 1px rgba(0, 0, 0, 0.05)',
                'elevation-2': '0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 6px 2px rgba(0, 0, 0, 0.05)',
                'elevation-3': '0 1px 3px rgba(0, 0, 0, 0.1), 0 4px 8px 3px rgba(0, 0, 0, 0.05)',
                'elevation-4': '0 2px 3px rgba(0, 0, 0, 0.1), 0 6px 10px 4px rgba(0, 0, 0, 0.05)',
                'elevation-5': '0 4px 4px rgba(0, 0, 0, 0.1), 0 8px 12px 6px rgba(0, 0, 0, 0.05)',
            },
            transitionTimingFunction: {
                'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
                'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
                'emphasized-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
            }
        },
    },
    plugins: [],
}
