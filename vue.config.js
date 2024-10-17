module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/gtionline' : '/',
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]',
      });
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_main.scss";
        `,
      },
    },
  },
  configureWebpack: {
    devServer: {
      client: {
        logging: 'warn',
      },
      watchFiles: {
        options: {
          usePolling: true,
        },
      },
    },
  },
};
