// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js', // Your library's entry point
      name: 'AnybodyProblem', // The global variable name when including your library via a <script> tag
      fileName: (format) => `anybody-problem.${format}.js` // The output file name
    },
    // rollupOptions: {
    // Externalize peer dependencies
    // external: ['vue'],
    // output: {
    // Provide global variables for externalized dependencies in UMD builds
    // globals: {
    // vue: 'Vue'
    // }
    // }
    // }
  }
});
