// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.codezone.dev', // Reemplaza con tu dominio real
  output: 'server',
  adapter: netlify(),
  
  build: {
    inlineStylesheets: 'auto', // Inline CSS pequeño automáticamente
  },
  
  vite: {
    plugins: [tailwindcss(), imagetools()],
    build: {
      minify: 'esbuild', // Minificación rápida con esbuild
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar vendor chunks grandes
            'lenis': ['lenis'],
            'gsap': ['gsap'],
          }
        }
      }
    }
  },
  
  // Compresión nativa de Astro
  compressHTML: true,
  
  // Configuración de imagen para optimización
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // Permite imágenes grandes si es necesario
      }
    }
  }
});
