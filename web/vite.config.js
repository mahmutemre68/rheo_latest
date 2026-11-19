import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                // Framework code changes far less often than app code; keeping it
                // in its own chunk keeps the app entry small and cacheable.
                manualChunks(id) {
                    if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'vendor-motion'
                    if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor-react'
                },
            },
        },
    },
})
