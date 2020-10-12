import * as React from "react";

export interface Props {
  containerIds: string[];
}

export const Component: React.FC<Props> = ({ containerIds }) => {
  if (containerIds.length === 0) {
    return null;
  }
  return (
    <script
      src={`https://www.googleoptimize.com/optimize.js?id=${containerIds[0]}`}
    />
  );
};

Component.displayName = "GoogleOptimizeScript";
