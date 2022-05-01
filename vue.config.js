const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/web_v2' : '/',
  pwa: {
    manifestOptions: {
      name: 'СГК Расписание',
      short_name: 'СГК Расписание',
      theme_color: '#1620A5'
    },
    themeColor: '#1620A5',
    msTileColor: '#000000'
  }
})
