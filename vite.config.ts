import { defineConfig } from 'vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import { tauri } from 'vite-plugin-tauri' // 1. import the plugin
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

export default defineConfig({
  esbuild: {
    jsxImportSource: 'tsx-dom',
    jsxInject: 'import { h } from \'tsx-dom\''
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    VitePWA(),
    VitePluginBrowserSync(),
    tauri() // 2. add it to the plugins list
  ],

  // 3. optional but recommended
  clearScreen: false,
  server: {
    open: false
  }
})
