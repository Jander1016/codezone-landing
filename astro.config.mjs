// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import { fileURLToPath } from 'url';
// Note: For Astro v3+ prefer `astro:assets`. We're adding imagetools for build optimizations.

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), imagetools()],
  }
});