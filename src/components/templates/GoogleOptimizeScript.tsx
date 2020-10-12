import * as React from "react";

export interface Props {
  containerIds: string[];
}

export const Component: React.FC<Props> = ({ containerIds }) => {
  return (
    <>
      {containerIds.map(containerId => {
        return <script key={containerId} src={`https://www.googleoptimize.com/optimize.js?id=${containerId}`} />;
      })}
    </>
  );
};

Component.displayName = "GoogleOptimizeScript";
