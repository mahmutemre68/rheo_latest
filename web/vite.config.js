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
                    // Firebase (live duels only, lazy): one chunk per package. Its files
                    // are all called index.esm.js, which would otherwise yield several
                    // same-named chunks that the bundle verifier treats as stale.
                    const fb = id.match(/node_modules\/@firebase\/([a-z-]+)\//)
                    if (fb) return `vendor-firebase-${fb[1]}`
                    if (id.includes('node_modules/firebase/')) return 'vendor-firebase'
                    if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'vendor-motion'
                    if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor-react'
                },
            },
        },
    },
})
