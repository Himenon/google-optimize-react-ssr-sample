import * as React from "react";
import * as Share from "./share";
// client sideの成果物が出来上がってから読み込む
const manifest = require("../dist/manifest");

export interface Props {
  meta: {
    title: string;
    description: string;
    // Google Analytics
    analytics?: {
      trackingId: string;
      optimizeExperiments?: {
        experimentId: string;
        variationId: string;
      }[];
    };
    // Google Optimize
    optimize?: {
      containerId: string;
    };
  };
  // Server SideとClient Sideで共有するのProps
  shareProps: Share.Props;
}

/**
 * Server Side Renderingで利用するBody以外のTemplate Component
 */
export const Component: React.FC<Props> = ({
  meta,
  shareProps,
  children,
}) => {
  const params = {
    experiments: ((meta.analytics && meta.analytics.optimizeExperiments) || []).map(
      ({ experimentId, variationId }) => {
        return {
          id: experimentId,
          variant: variationId,
        };
      }
    ),
  };
  const configParams = JSON.stringify(params);
  return (
    <html lang="ja">
      <head>
        {meta.optimize && (
          <script
            src={`https://www.googleoptimize.com/optimize.js?id=${meta.optimize.containerId}`}
          />
        )}
        {meta.analytics && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${meta.analytics.trackingId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: [
                  `window.dataLayer = window.dataLayer || [];`,
                  `function gtag(){dataLayer.push(arguments);}`,
                  `gtag("js", new Date());`,
                  `gtag("config", "${meta.analytics.trackingId}", ${configParams});`,
                ]
                  .filter(Boolean)
                  .join(""),
              }}
            />
          </>
        )}
        <title>{meta.title}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <script dangerouslySetInnerHTML={{__html: `window.__INIT_PROPS__ = JSON.parse('${JSON.stringify(shareProps)}')`}} />
        <script defer src={`/assets${manifest["scripts/react.production.min.js"]}`} />
        <script defer src={`/assets${manifest["scripts/react-dom.production.min.js"]}`} />
        <script defer src={`/assets${manifest["application.js"]}`} />
      </head>
      <body>{children}</body>
    </html>
  );
};
