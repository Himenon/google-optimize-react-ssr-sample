export interface GoogleAnalytics {
  trackingId: string;
  sendPageView: boolean;
}

export interface GoogleOptimizeExperiment {
  googleAnalytics: GoogleAnalytics;
  googleAnalyticsTestId: string;
  variationId: string | number;
}

export interface GoogleOptimize {
  containerId: string;
  experiments: GoogleOptimizeExperiment[];
}

export interface ServerSideExperimentSetting {
  /**
   * 発行されたGoogle AnalyticsテストID
   */
  googleAnalyticsTestId: string;
  /**
   * GAのTrackingID
   */
  googleAnalyticsTrackingId: string;
  /**
   * GA設定時にPage Viewを送信するか
   */
  sendPageView: boolean;
  /**
   * Google Optimizeで定義したテストパターン
   */
  validPatterns: number[];
  /**
   * 開始日時: YYYY-MM-DD hh:mm
   */
  startDate: string;
  /**
   * 終了日時: YYYY-MM-DD hh:mm
   */
  stopDate: string;
}
