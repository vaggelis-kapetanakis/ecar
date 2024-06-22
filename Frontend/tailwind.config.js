module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    boxShadow: {
      cardBox: "10px 10px 30px -8px #000000",
    },
    extend: {
      colors: {
        primary: {
          100: "#cde4fa",
          200: "#9cc9f4",
          300: "#6aafef",
          400: "#3994e9",
          500: "#0779e4",
          600: "#0661b6",
          700: "#044989",
          800: "#03305b",
          900: "#01182e",
        },
        secondary: {
          100: "#d5f3fe",
          200: "#abe6fd",
          300: "#82dafd",
          400: "#58cdfc",
          500: "#2ec1fb",
          600: "#259ac9",
          700: "#1c7497",
          800: "#124d64",
          900: "#092732",
        },
        tertiary: {
          100: "#dceeff",
          200: "#b9ddff",
          300: "#96ccff",
          400: "#73bbff",
          500: "#50aaff",
          600: "#4088cc",
          700: "#306699",
          800: "#204466",
          900: "#102233",
        },
        danger: {
          100: "#fdd5d5",
          200: "#fbabab",
          300: "#fa8080",
          400: "#f85656",
          500: "#f62c2c",
          600: "#c52323",
          700: "#941a1a",
          800: "#621212",
          900: "#310909",
        },
        success: {
          100: "#cdfae7",
          200: "#9cf4cf",
          300: "#6aefb8",
          400: "#39e9a0",
          500: "#07e488",
          600: "#06b66d",
          700: "#048952",
          800: "#035b36",
          900: "#012e1b",
        },
        dimWhite: "rgba(255, 255, 255, 0.7)",
        whitesmoke: {
          100: "#fcfcfcf5",
          200: "#f9f9f9eb",
          300: "#f5f5f5e0",
          400: "#f0f0f0d6",
          500: "#ebebebcc",
          600: "#abababd6",
          700: "#767676e0",
          800: "#484848eb",
          900: "#222222f5",
        },
        lightWhite: "rgba(235, 235, 235, 0.5)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        navOp: {
          100: "#ccccd2",
          200: "#9999a5",
          300: "#676778",
          400: "#34344b",
          500: "#01011e",
          600: "#010118",
          700: "#010112",
          800: "#00000c",
          900: "#000006",
        },
        nav: "#23262f",
        bgDark: "#1f2937",
        dark1: "#323644",
        dark2: "#474E68",
        dark3: "#50577A",
        dark4: "#6B728E",
        darkBlue: "rgba(1,1,20,1)",
        darkerBlue: "hsl(231, 94%, 13%)",
        lighterBlue: "hsl(231, 94%, 31%)",
        bgBlue: {
          100: "#cdcfd6",
          200: "#9b9fad",
          300: "#696f84",
          400: "#373f5b",
          500: "#050f32",
          600: "#040c28",
          700: "#03091e",
          800: "#020614",
          900: "#01030a",
        },
        bgBlueLight: {
          100: "#d1d3de",
          200: "#a3a7bd",
          300: "#757b9c",
          400: "#474f7b",
          500: "#19235a",
          600: "#141c48",
          700: "#0f1536",
          800: "#0a0e24",
          900: "#050712",
        },
        loginBorder: "rgba(7, 121, 228, 0.65)",
      },
      fontFamily: {
        poppins: ["Arial", "Helvetica", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 8s ease-in-out",
        lightIn: "lightIn 8s infinite ease-in-out",
        popUp: "popUp 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, display: "none", transform: "translateY(600px)" },
          "80%": {
            opacity: 0,
            display: "none",
            transform: "translateY(300px)",
          },
          "100%": {
            opacity: 1,
            display: "block",
            transform: "translateY(0px)",
          },
        },
        pulse: {
          "0%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 #2ec1fb",
          },

          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 10px rgba(52, 172, 224, 0)",
          },

          "100%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 0 0 rgba(52, 172, 224, 0)",
          },
        },
        lightIn: {
          "0%": {
            opacity: 0.3,
          },
          "40%": {
            opacity: 0.7,
          },
          "60%": {
            opacity: 1,
          },
          "80%": {
            opacity: 0.7,
          },
          "100%": {
            opacity: 0.3,
          },
        },
        popUp: {
          "0%": {
            transform: "scale(0.01)",
            opacity: 0.1,
          },
          "70%": {
            transform: "scale(1.1)",
            opacity: 0.75,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
      },
      minHeight: {
        590: "590px",
      },
      backgroundImage: {
        "hero-pattern": "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
      },
    },
    screens: {
      xxs: "360px",
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("flowbite/plugin")],
};
