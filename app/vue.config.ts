import path from "path";

module.exports = {
  devServer: {
    proxy: {
      "^/": {
        target: `http://localhost:${4000}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  outputDir: path.resolve(__dirname, process.env.OUTPUT_DIR),
};
