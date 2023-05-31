/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#A50104'
      },
      transitionProperty: {
        visibility: 'visibility'
      },
      keyframes: {
        crossTop: {
          to: {
            transform: 'translateY(8px) rotate(45deg)'
          }
        },
        burgerTop: {
          from: {
            transform: 'translateY(6px) rotate(45deg)'
          }
        },
        crossMiddle: {
          to: {
            width: 0
          }
        },
        burgerMiddle: {
          from: {
            width: 0
          }
        },
        crossBottom: {
          to: {
            transform: 'translateY(-8px) rotate(-45deg)'
          }
        },
        burgerBottom: {
          from: {
            transform: 'translateY(-6px) rotate(-45deg)'
          }
        },
        fadeIn: {
          from: {
            opacity: 0
          }
        },
        fadeOut: {
          to: {
            opacity: 0
          }
        },
        slideLeft: {
          from: {
            transform: 'translateX(50%)',
            opacity: 0
          }
        },
        slideRight: {
          to: {
            transform: 'translateX(50%)',
            opacity: 0
          }
        },
        slideBottom: {
          from: {
            transform: 'translateY(-50%)',
            opacity: 0
          }
        },
        slideTop: {
          to: {
            transform: 'translateY(-50%)',
            opacity: 0
          }
        }
      },
      animation: {
        'cross-top': 'crossTop 0.3s ease-in-out forwards',
        'burger-top': 'burgerTop 0.3s ease-in-out forwards',
        'cross-middle': 'crossMiddle 0.1s ease-in-out forwards',
        'burger-middle': 'burgerMiddle 0.3s ease-in-out forwards',
        'cross-bottom': 'crossBottom 0.3s ease-in-out forwards',
        'burger-bottom': 'burgerBottom 0.3s ease-in-out forwards',
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'fade-out': 'fadeOut 0.3s ease-in-out forwards',
        'slide-left': 'slideLeft 0.3s ease-in-out forwards',
        'slide-right': 'slideRight 0.3s ease-in-out forwards',
        'slide-bottom': 'slideBottom 0.3s ease-in-out forwards',
        'slide-top': 'slideTop 0.3s ease-in-out forwards'
      }
    }
  },
  plugins: []
};
