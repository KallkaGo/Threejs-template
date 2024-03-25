// vite.config.ts
import { defineConfig } from "file:///D:/work/%E5%A4%A7%E7%BE%8E%E4%B8%AD%E5%9B%BD/meo_art_of_china_2024_r3f/node_modules/.pnpm/vite@5.1.3_@types+node@20.11.19/node_modules/vite/dist/node/index.js";
import glsl from "file:///D:/work/%E5%A4%A7%E7%BE%8E%E4%B8%AD%E5%9B%BD/meo_art_of_china_2024_r3f/node_modules/.pnpm/vite-plugin-glsl@1.2.1_vite@5.1.3/node_modules/vite-plugin-glsl/src/index.js";
import react from "file:///D:/work/%E5%A4%A7%E7%BE%8E%E4%B8%AD%E5%9B%BD/meo_art_of_china_2024_r3f/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.1.3/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "D:\\work\\\u5927\u7F8E\u4E2D\u56FD\\meo_art_of_china_2024_r3f";
var isCodeSandbox = "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;
var vite_config_default = defineConfig({
  base: "./",
  assetsInclude: ["**/*.glb", "**/*.mp3", "**/*.ico"],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src/"),
      "@textures": path.resolve(__vite_injected_original_dirname, "./static/assets/textures/"),
      "@models": path.resolve(__vite_injected_original_dirname, "./static/assets/models/"),
      "@images": path.resolve(__vite_injected_original_dirname, "./static/assets/images/")
    }
  },
  server: {
    host: true,
    open: !isCodeSandbox
    // Open if it's not a CodeSandbox
  },
  plugins: [
    glsl({
      compress: true,
      watch: true
    }),
    react()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrXFxcXFx1NTkyN1x1N0Y4RVx1NEUyRFx1NTZGRFxcXFxtZW9fYXJ0X29mX2NoaW5hXzIwMjRfcjNmXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3b3JrXFxcXFx1NTkyN1x1N0Y4RVx1NEUyRFx1NTZGRFxcXFxtZW9fYXJ0X29mX2NoaW5hXzIwMjRfcjNmXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93b3JrLyVFNSVBNCVBNyVFNyVCRSU4RSVFNCVCOCVBRCVFNSU5QiVCRC9tZW9fYXJ0X29mX2NoaW5hXzIwMjRfcjNmL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGdsc2wgZnJvbSBcInZpdGUtcGx1Z2luLWdsc2xcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuY29uc3QgaXNDb2RlU2FuZGJveCA9XHJcbiAgICBcIlNBTkRCT1hfVVJMXCIgaW4gcHJvY2Vzcy5lbnYgfHwgXCJDT0RFU0FOREJPWF9IT1NUXCIgaW4gcHJvY2Vzcy5lbnY7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogXCIuL1wiLFxyXG4gICAgYXNzZXRzSW5jbHVkZTogW1wiKiovKi5nbGJcIiwgXCIqKi8qLm1wM1wiLCBcIioqLyouaWNvXCJdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL1wiKSxcclxuICAgICAgICAgICAgXCJAdGV4dHVyZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3N0YXRpYy9hc3NldHMvdGV4dHVyZXMvXCIpLFxyXG4gICAgICAgICAgICBcIkBtb2RlbHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3N0YXRpYy9hc3NldHMvbW9kZWxzL1wiKSxcclxuICAgICAgICAgICAgXCJAaW1hZ2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zdGF0aWMvYXNzZXRzL2ltYWdlcy9cIiksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBob3N0OiB0cnVlLFxyXG4gICAgICAgIG9wZW46ICFpc0NvZGVTYW5kYm94LCAvLyBPcGVuIGlmIGl0J3Mgbm90IGEgQ29kZVNhbmRib3hcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgZ2xzbCh7XHJcbiAgICAgICAgICAgIGNvbXByZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICB3YXRjaDogdHJ1ZSxcclxuICAgICAgICB9KSxcclxuICAgICAgICByZWFjdCgpLFxyXG4gICAgXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFUsU0FBUyxvQkFBb0I7QUFDelcsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTSxnQkFDRixpQkFBaUIsUUFBUSxPQUFPLHNCQUFzQixRQUFRO0FBR2xFLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLE1BQU07QUFBQSxFQUNOLGVBQWUsQ0FBQyxZQUFZLFlBQVksVUFBVTtBQUFBLEVBQ2xELFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLFFBQVE7QUFBQSxNQUNyQyxhQUFhLEtBQUssUUFBUSxrQ0FBVywyQkFBMkI7QUFBQSxNQUNoRSxXQUFXLEtBQUssUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxNQUM1RCxXQUFXLEtBQUssUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxJQUNoRTtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU0sQ0FBQztBQUFBO0FBQUEsRUFDWDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0QsVUFBVTtBQUFBLE1BQ1YsT0FBTztBQUFBLElBQ1gsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLEVBQ1Y7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
