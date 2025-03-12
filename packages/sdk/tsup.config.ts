import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Ensure this points to the correct entry
  format: ['cjs', 'esm'], // Build for both CommonJS and ESM
  //   dts: true, // Generate TypeScript declaration files
  splitting: false, // Disable code splitting
  sourcemap: false, // No need for source maps in a library
  clean: true, // Clean output folder before each build
  minify: false, // Disable minification for debugging
  //   noExternal: ['@headless-gamify/common', '@headless-gamify/prisma-client'], // Force bundling
  external: [], // Prevent tsup from marking dependencies as external
});
