import { defineConfig } from "vite";
import HtmlRawImport from "./vite-plugin-html-import";

export default defineConfig({
  build: {
    emptyOutDir: false,
  },
  plugins: [HtmlRawImport()],
});
