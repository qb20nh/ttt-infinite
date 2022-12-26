import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  esbuild: {
    jsxImportSource: 'tsx-dom',
    jsxInject: 'import { h } from \'tsx-dom\''
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
