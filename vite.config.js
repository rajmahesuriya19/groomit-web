import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', { regenerator: true }]
        ]
      }
    }),
    jsconfigPaths()
  ],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@babel/runtime': resolve(__dirname, 'node_modules/@babel/runtime')
    }
  },
  server: {
    port: 5173
  }
});
