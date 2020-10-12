import * as React from "react";
import * as App from "react";
import * as Target from "./Target";

export interface Props {
  target: Target.Props;
}

export const Component: App.FC<Props> = props => {
  return <Target.Component {...props.target} />;
};

Component.displayName = "App";
