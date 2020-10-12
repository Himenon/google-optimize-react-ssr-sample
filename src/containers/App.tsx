import * as App from "../components/App";
import * as Target from "./Target";

export interface Props {
  target: Target.Props;
}

export const generateProps = (props: Props): App.Props => {
  return {
    target: Target.generateProps(props.target),
  };
};
