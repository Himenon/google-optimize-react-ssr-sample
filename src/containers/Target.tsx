import * as Target from "../components/Target";

export interface Props {
  testCase: 0 | 1;
}

export const generateProps = (props: Props): Target.Props => {
  return {
    title: {
      children: `TestCase: ${props.testCase}`,
    },
    optimizeTargetButton: {
      children: "Click Me !",
      onClick: () => {
        gtag("event", "click", {
          event_category: "UserInputEvent",
          event_label: "click-me",
        });
      },
    },
  };
};
