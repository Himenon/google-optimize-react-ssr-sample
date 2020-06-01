import * as React from "react";
import * as Optimize from "./Optimize";

export interface Props {
  title: string;
  hogeButton: JSX.IntrinsicElements["button"];
  fugaButton: JSX.IntrinsicElements["button"];
}

export const Component: React.FC<Props> = ({
  title,
  fugaButton,
  hogeButton,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>
        <button type="button" {...fugaButton} />
      </p>
      <p>
        <button type="button" {...hogeButton} />
      </p>
    </div>
  );
};

/**
 * A/Bテスト用のProps
 */
const props: { [key in Optimize.Props["hogeOrFugaVariationId"]]: Props } = {
  0: {
    title: `押しちゃだめなシリーズ v0`,
    fugaButton: {
      children: "絶対に押してほしいボタンFUGA",
      onClick: () => {
        gtag("event", "click", {
          event_category: "UserInputEvent",
          event_label: "fuga",
        });
      },
    },
    hogeButton: {
      children: "ぜったいに押してほしくないボタンHOGE",
      onClick: () => {
        gtag("event", "click", {
          event_category: "UserInputEvent",
          event_label: "hoge",
        });
      },
    },
  },
  1: {
    title: "押しちゃだめなシリーズ v1",
    fugaButton: {
      children: "ぜったいに押してほしくないボタンFUGA",
      onClick: () => {
        gtag("event", "click", {
          event_category: "UserInputEvent",
          event_label: "fuga",
        });
      },
    },
    hogeButton: {
      children: "絶対に押してほしいボタンHOGE",
      onClick: () => {
        gtag("event", "click", {
          event_category: "UserInputEvent",
          event_label: "hoge",
        });
      },
    },
  },
};

export const generateProps = ({ hogeOrFugaVariationId: variationId }: Optimize.Props): Props =>
  props[variationId];
