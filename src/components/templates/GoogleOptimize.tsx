import * as React from "react";
import { EOL } from "os";
import { GoogleOptimizeExperiment } from "../../types";

export interface CodeProps {
  containerId: string;
  experiments: GoogleOptimizeExperiment[];
}

export interface Props {
  googleOptimizeList: CodeProps[];
}

export const generateCode = ({ containerId, experiments }: CodeProps) => {
  const experimentConfig = experiments.map(exp => {
    return {
      id: exp.googleAnalyticsTestId,
      variant: exp.variationId,
    };
  });
  return experiments.map(experiment => {
    const config = JSON.stringify(
      {
        optimize_id: containerId, // https://support.google.com/optimize/answer/7513085?hl=ja
        send_page_view: experiment.googleAnalytics.sendPageView, // https://support.google.com/optimize/answer/7513085?hl=ja
        /**
         * @see https://support.google.com/optimize/thread/36142685?hl=en&msgid=36785067
         * @see https://stackoverflow.com/questions/50686295/gtag-js-optmize-server-side-implementation-not-working
         */
        experiments: experimentConfig,
      },
      null,
      2,
    );
    return `gtag("config", "${experiment.googleAnalytics.trackingId}", ${config});`;
  });
};

export const Component: React.FC<Props> = ({ googleOptimizeList }) => {
  const codes = googleOptimizeList.map(generateCode);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: [`window.dataLayer = window.dataLayer || [];`, `function gtag(){dataLayer.push(arguments);}`, `gtag("js", new Date());`]
          .concat(...codes)
          .join(EOL),
      }}
    />
  );
};

Component.displayName = "GoogleOptimize";
