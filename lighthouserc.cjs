module.exports = {
  ci: {
    collect: {
      staticDistDir: ".",
      url: ["http://localhost:4173/"],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--headless=new --no-sandbox --disable-gpu --user-data-dir=.lighthouse-profile"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
        "categories:accessibility": ["warn", { minScore: 0.8 }],
        "categories:best-practices": ["warn", { minScore: 0.75 }],
        "categories:seo": ["warn", { minScore: 0.8 }]
      }
    },
    upload: {
      target: "filesystem",
      outputDir: "./lighthouse-report"
    }
  }
};
