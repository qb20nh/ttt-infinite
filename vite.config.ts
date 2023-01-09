import path from 'path'
import { defineConfig } from 'vite'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
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
    VitePluginBrowserSync()
    // ,...(process.env.GITHUB_ACTIONS === undefined ? [tauri()] : [])
  ],

  // 3. optional but recommended

  ...(process.env.GITHUB_ACTIONS === undefined
    ? {
        clearScreen: false,
        server: {
          open: false
        }
      }
    : {})
})
