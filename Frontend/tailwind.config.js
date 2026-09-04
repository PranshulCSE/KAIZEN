export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                ink: '#14161A',
                paper: '#FFFFFF',
                surface: '#F6F7F2',
                lime: {
                    DEFAULT: '#D7FA3B',
                    dim: '#EFFCB8',
                    bright: '#E8FC4B',
                },
                muted: '#63666C',
                line: '#14161A',
                hairline: '#E4E5DF',
                danger: {
                    DEFAULT: '#FF5A52',
                    light: '#FFE3E1',
                },
            },
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            fontSize: {
                xs: ['12px', '16px'],
                sm: ['13px', '18px'],
                base: ['14px', '20px'],
                lg: ['16px', '24px'],
                xl: ['18px', '28px'],
                '2xl': ['20px', '28px'],
                '3xl': ['24px', '32px'],
            },
            boxShadow: {
                brutal: '5px 5px 0 0 #14161A',
                'brutal-sm': '3px 3px 0 0 #14161A',
                'brutal-lime': '5px 5px 0 0 #D7FA3B',
                'brutal-lg': '8px 8px 0 0 #14161A',
                none: 'none',
            },
            borderRadius: {
                pill: '999px',
                sm: '4px',
                md: '6px',
                lg: '8px',
            },
            borderWidth: {
                DEFAULT: '2px',
                0: '0px',
                1: '1px',
                2: '2px',
                4: '4px',
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '24px',
                '2xl': '32px',
                '3xl': '48px',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease-out',
                strike: 'strike 0.3s ease-out',
            },
            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                strike: {
                    '0%': { textDecoration: 'none' },
                    '100%': { textDecoration: 'line-through' },
                },
            },
        },
    },
    plugins: [],
};