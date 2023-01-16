import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import * as packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/Tooltip.jsx',
      fileName: (format) => `tulitip.${format}.js`,
      name: 'Tulitip',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)]
    }
  }
})
