module.exports = {
  mode: "jit",
  purge: {
    enabled: false,
    content: ["./**/*.liquid"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xxs: '0.75rem',
        xs: '0.8125rem',
        sm: '0.9375rem',
        '2xl': '1.375rem',
        '3xl': '1.625rem',
        '4xl': '2rem',
        '5xl': '2.625rem',
        '6xl': '3.5625rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
