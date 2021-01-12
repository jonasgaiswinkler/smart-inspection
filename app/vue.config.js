module.exports = {
  pwa: {
    name: 'Smart Inspection',
    themeColor: '#005096',
    msTileColor: '#005096'
  },
  publicPath: '/',
  //lintOnSave: process.env.NODE_ENV !== 'production'
  configureWebpack: {
    module: {
      rules: [
        {
          test: /pdf\.worker(\.min)?\.js$/,
          loader: 'file-loader'
        },
      ],
    },
  },
}