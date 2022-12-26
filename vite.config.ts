import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxImportSource: 'tsx-dom',
    jsxInject: `import { h } from 'tsx-dom'`,
  }
});