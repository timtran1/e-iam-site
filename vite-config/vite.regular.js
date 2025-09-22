/**
 * Regular build configuration (for development and normal production)
 */
export const regularConfig = {
  build: {
    assetsInlineLimit: 0, // Don't inline assets for regular build
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
};
