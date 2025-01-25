import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      console.log("Registering code coverage task...");
      codeCoverageTask(on, config); // Register the code coverage task here
      return config;
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}"
  },
});
