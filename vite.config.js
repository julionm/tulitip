import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import * as packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), libInjectCss()],
  build: {
    lib: {
      entry: 'src/Tooltip.jsx',
      fileName: (format) => `tulitip.${format}.js`,
      name: 'Tulitip',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies), 'react/jsx-runtime'],
    }
  }
})
