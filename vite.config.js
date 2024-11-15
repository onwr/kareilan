import viteReactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import viteConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: { reportCompressedSize: false },
  server: {
    host: '0.0.0.0', // Ağdaki diğer cihazlardan erişim için
    port: 3000, // Dilersen portu değiştirebilirsin
  },
  plugins: [
    viteConfigPaths(),
    viteReactPlugin(),
    // eslint-disable-next-line no-undef
    process.env.INLINE ? viteSingleFile() : null,
  ].filter(Boolean),
});
