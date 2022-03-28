module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/materials/gti/'
    : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_main.scss";
        `,
      },
    },
  },
  configureWebpack: {
    devServer: {
      clientLogLevel: 'info',
      watchOptions: {
        poll: true,
      },
    },
  },
};
