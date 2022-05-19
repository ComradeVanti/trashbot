import { fileURLToPath, URL } from "url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// resolve: {
//   alias: {
//     "@": fileURLToPath(new URL("./src", import.meta.url)),
//   },
// },
// server: {
//   // @ts-ignore
//   port: parseInt(import.meta.env.VITE_PORT),
//   proxy: {
//     "/api": {
//       target: "http://localhost:3000",
//       changeOrigin: true,
//       rewrite: (path) => path.replace(/^\/api/, ""),
//     },
//   },
// },
// });

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT

  return defineConfig({
    plugins: [vue()],
    build: {
      target: "esnext",
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    server: {
      port: parseInt(process.env.VITE_PORT),
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          //target: process.env.VITE_BASEURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
