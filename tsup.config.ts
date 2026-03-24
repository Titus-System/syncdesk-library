import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2020',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', '@tanstack/react-query'], // ignore these libs on the bundle.
});
