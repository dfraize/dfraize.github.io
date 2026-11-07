// Dev server only. The site is plain static HTML deployed straight from the
// repo to GitHub Pages; Vite is never used to build or bundle it, so nothing
// here affects production. `strictPort` makes startup fail loudly if 3000 is
// taken instead of silently moving to another port.
import { defineConfig } from 'vite';

export default defineConfig({
    appType: 'mpa', // unknown paths 404 instead of falling back to index.html
    server: {
        host: '127.0.0.1',
        port: 3000,
        strictPort: true,
        open: false,
        watch: {
            // Raw source images are large and never served; the optimized copies are.
            ignored: ['**/images/projects/**', '**/images/about/**'],
        },
    },
});
