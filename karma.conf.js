// Karma configuration file
// https://karma-runner.github.io/latest/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("karma-sonarqube-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // Configuration options for Jasmine
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },

    // Coverage reporter configuration
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/my-angular-app"),
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "lcov" }, // Required for SonarQube
      ],
      // Fail if coverage is below thresholds
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },

    // SonarQube reporter configuration
    sonarqubeReporter: {
      basePath: "src/app",
      filePattern: "**/*.spec.ts",
      outputFolder: "reports",
      reportName: "ut_report.xml",
    },

    reporters: ["progress", "kjhtml", "coverage", "sonarqube"],
    browsers: ["Chrome"],
    restartOnFileChange: true,

    // CI-specific configuration
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu"],
      },
    },

    // Thresholds - fail build if coverage drops below
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 80,
        functions: 80,
      },
    },
  });
};

