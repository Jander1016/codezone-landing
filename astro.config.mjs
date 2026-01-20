// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  
  build: {
    inlineStylesheets: 'auto', // Inline CSS pequeño automáticamente
  },

  
  
  vite: {
    plugins: [tailwindcss(), imagetools()],
    build: {
      cssCodeSplit: true, // Split CSS por ruta
      minify: 'esbuild', // Minificación rápida
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar vendor chunks grandes
            'lenis': ['lenis'],
          }
        }
      }
    }
  },
  
  // Compresión nativa de Astro
  compressHTML: true,
  adapter: netlify(),
});
