import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['mapbox-gl'],
    },
    server: {
        host: true, // Needed for docker
        port: 5173,
        watch: {
            usePolling: true, // Needed for docker on some OSes
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
