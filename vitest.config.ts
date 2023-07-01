import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    alias: [
      {
        find: /^tailwind-merge\/src\/lib/,
        replacement: resolve("./node_modules/tailwind-merge/src/lib")
      }
    ]
  }
});
