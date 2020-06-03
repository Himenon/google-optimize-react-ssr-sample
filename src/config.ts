const pkg = require("../package");

export const config = {
  site: {
    title: pkg.name,
    description: pkg.description,
  },
  analytics: {
    trackingId: "YOUR_ANALYTICS_TRACKING_ID",
  },
  optimize: {
    containerId: "YOUR_OPTIMIZE_CONTAINER_ID",
    experiment: {
      "hoge-or-fuga": {
        id: "YOUR_EXPERIMENT_ID",
      },
    },
  },
};
