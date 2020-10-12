import * as React from "react";
import { EOL } from "os";
import { GoogleOptimizeExperiment } from "./types";

export interface Props {
  containerId: string;
  experiments: GoogleOptimizeExperiment[];
}

export const Component: React.FC<Props> = ({ containerId, experiments }) => {
  const googleAnalyticsAndOptimize = experiments.map(experiment => {
    const config = JSON.stringify(
      {
        id: experiment.googleAnalyticsTestId,
        variant: experiment.variationId,
        optimize_id: containerId, // https://support.google.com/optimize/answer/7513085?hl=ja
        send_page_view: experiment.googleAnalytics.sendPageView, // https://support.google.com/optimize/answer/7513085?hl=ja
      },
      null,
      2,
    );
    return `gtag("config", "${experiment.googleAnalytics.trackingId}", ${config});`;
  });
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: [`window.dataLayer = window.dataLayer || [];`, `function gtag(){dataLayer.push(arguments);}`, `gtag("js", new Date());`]
          .concat(googleAnalyticsAndOptimize)
          .join(EOL),
      }}
    />
  );
};

Component.displayName = "GoogleOptimize";
