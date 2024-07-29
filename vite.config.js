import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import viteReact from "@vitejs/plugin-react";
// import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx"],
            refresh: true,
        }),
        viteReact(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
            },
        },
    },
    server: {
        host: "localhost",
    },
});
