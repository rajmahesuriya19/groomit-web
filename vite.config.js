import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths()
  ],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: [
      '@babel/runtime/helpers/createSuper',
      '@babel/runtime/helpers/extends',
      '@babel/runtime/helpers/classCallCheck',
      '@babel/runtime/helpers/inherits',
      '@babel/runtime/helpers/interopRequireDefault'
    ]
  },
  server: {
    port: 5173
  }
});
