export interface GoogleAnalytics {
  trackingId: string;
  sendPageView: boolean;
}

export interface GoogleOptimizeExperiment {
  googleAnalytics: GoogleAnalytics;
  googleAnalyticsTestId: string;
  variationId: string;
}

export interface GoogleOptimize {
  containerId: string;
  experiments: GoogleOptimizeExperiment[];
}


