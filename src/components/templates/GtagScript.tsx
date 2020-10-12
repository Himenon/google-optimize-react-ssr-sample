import * as React from "react";

export interface Props {
  trackingIds: string[];
}

export const Component: React.FC<Props> = ({ trackingIds }) => {
  if (trackingIds.length === 0) {
    return null;
  }
  return (
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${trackingIds[0]}`}
    />
  );
};

Component.displayName = "GtagScript";
