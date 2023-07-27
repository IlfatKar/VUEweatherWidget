const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
  productionSourceMap: false,
  filenameHashing: false,
  transpileDependencies: true,
});
