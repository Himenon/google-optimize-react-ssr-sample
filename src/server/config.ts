import * as Types from "../types";
const pkg = require("../../package.json");

export const config = {
  site: {
    title: pkg.name,
    description: pkg.description,
  },
};

export const optimizeList: { [containerId: string]: Types.ServerSideExperimentSetting[] } = {
  "OPT-54BH7RB": [
    {
      googleAnalyticsTestId: "mc61s62uSI-b-tBbzwPvew",
      googleAnalyticsTrackingId: "UA-167562669-2",
      sendPageView: true,
      validPatterns: [0, 1, 2],
      startDate: "2020-10-01 10:00",
      stopDate: "2020-10-31 10:00",
    },
  ],
  "OPT-MDV9H3J": [
    {
      googleAnalyticsTestId: "mc61s62uSI-b-tBbzwPvew",
      googleAnalyticsTrackingId: "UA-167562669-2",
      sendPageView: false,
      validPatterns: [0, 1],
      startDate: "2020-10-01 10:00",
      stopDate: "2020-10-31 10:00",
    },
  ],
};

export const domain = "localhost";
