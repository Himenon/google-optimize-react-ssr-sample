import * as React from "react";
import * as Types from "./types";
import * as GtagScript from "./GtagScript";
import * as GoogleOptimize from "./GoogleOptimize";
import * as GoogleOptimizeScript from "./GoogleOptimizeScript";
import * as ClientSidePropsEmbed from "./ClientSidePropsEmbed";
const manifest = require("../../../dist/manifest.json");

export interface Props {
  meta: {
    /**
     * サイトタイトル
     */
    title: string;
    /**
     * サイトの説明
     */
    description: string;
    /**
     * 複数のGoogle OptimizeのコンテナIDに対応
     */
    googleOptimizeList: Types.GoogleOptimize[];
  };
  /**
   * Server SideとClient Sideで共有するのProps
   */
  clientSideRederingProps: any;
}
/**
 * Server Side Renderingで利用するBody以外のTemplate Component
 */
export const Component: React.FC<Props> = ({ meta, clientSideRederingProps, children }) => {
  const googleOptimizeContainerIds = meta.googleOptimizeList.map(googleOptimize => googleOptimize.containerId);
  const googleAnaltyicsTrackingIds = meta.googleOptimizeList.reduce<string[]>(
    (total, googleOptimize) => total.concat(googleOptimize.experiments.map(experiment => experiment.googleAnalytics.trackingId)),
    [],
  );
  return (
    <html lang="ja">
      <head>
        <GoogleOptimizeScript.Component containerIds={googleOptimizeContainerIds} />
        <GtagScript.Component trackingIds={googleAnaltyicsTrackingIds} />
        {meta.googleOptimizeList.map(googleOptimize => (
          <GoogleOptimize.Component key={googleOptimize.containerId} {...googleOptimize} />
        ))}
        <title>{meta.title}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <ClientSidePropsEmbed.Component __key={"__INIT_PROPS__"} {...clientSideRederingProps} />
        <script defer src={`/assets${manifest["scripts/react.production.min.js"]}`} />
        <script defer src={`/assets${manifest["scripts/react-dom.production.min.js"]}`} />
        <script defer src={`/assets${manifest["application.js"]}`} />
      </head>
      <body>{children}</body>
    </html>
  );
};

Component.displayName = "Template";
