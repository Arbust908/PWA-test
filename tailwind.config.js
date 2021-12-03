const colors = require('tailwindcss/colors');
module.exports = {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                title: ['Rubik', 'sans-serif'],
                body: ['Rubik', 'sans-serif'],
            },
            colors: {
                ...colors,
                main: {
                    50: 'var(--primary-50)',
                    100: 'var(--primary-50)',
                    200: 'var(--primary-200)',
                    300: 'var(--primary-300)',
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                    700: 'var(--primary-700)',
                    800: 'var(--primary-800)',
                    900: 'var(--primary-900)',
                },
                second: {
                    0: 'var(--second-0)',
                    50: 'var(--second-50)',
                    100: 'var(--second-100)',
                    200: 'var(--second-200)',
                    300: 'var(--second-300)',
                    400: 'var(--second-400)',
                    500: 'var(--second-500)',
                    600: 'var(--second-600)',
                    700: 'var(--second-700)',
                    800: 'var(--second-800)',
                    900: 'var(--second-900)',
                },
            },
            screens: {
                xs: '480px',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
