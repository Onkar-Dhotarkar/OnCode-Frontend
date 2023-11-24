/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Raleway: ["Raleway"],
        VarelaRound: ["Varela Round"],
        ArchivoBlack: ["Archivo Black"],
        Righteous: ["Righteous"],
        TiltWarp: ["Tilt Warp"],
      },
    },
  },

  plugins: [
    require('tailwind-scrollbar')
  ],
}

