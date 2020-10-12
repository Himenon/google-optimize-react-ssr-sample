import * as React from "react";

export interface Props {
  __key: string;
}

export const Component: React.FC<Props> = ({ __key, ...props }) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.${__key} = JSON.parse('${JSON.stringify(props)}')`,
      }}
    />
  );
};

Component.displayName = "ClientSidePropsEmbed";
