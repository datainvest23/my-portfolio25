/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'fade-in': 'fade-in 0.6s ease-out forwards',
  			'pulse-hover': 'pulse-hover 8s ease-in-out infinite'
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(12px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'pulse-hover': {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-2%)'
  				}
  			}
  		},
  		fontFamily: {
  			'work-sans': [
  				'var(--font-work-sans)',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		gridTemplateColumns: {
  			'portfolio': 'repeat(auto-fit, minmax(300px, 1fr))',
  		},
  		gridAutoRows: {
  			'portfolio': 'minmax(300px, auto)',
  		},
  		transformStyle: {
  			'preserve-3d': 'preserve-3d',
  		},
  		transform: {
  			'flip': 'rotateY(180deg)',
  		},
  		backfaceVisibility: {
  			'hidden': 'hidden',
  		},
  		perspective: {
  			'custom': '1000px',
  		},
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective': {
          'perspective': '1000px',
        },
      });
    },
  ],
  safelist: [
    'bg-blue-50',
    'border-blue-200',
    'text-blue-700',
    'text-blue-600',
    'hover:bg-blue-100',
    'hover:border-blue-300'
  ]
} 


