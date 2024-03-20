import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                joust: resolve(__dirname, "pages/joust/joust.html"),
            }
        }
    }
});