import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'src/tests/e2e/specs/**/*.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
