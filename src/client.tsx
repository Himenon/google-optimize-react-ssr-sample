import * as React from "react";
import * as ReactDOM from "react-dom";
import * as App from "./App";
import * as Share from "./share";

const getProps = (): Share.Props => {
  return (window as any).__INIT_PROPS__;
}

const main = async () => {
  const { optimize } = getProps();
  const container = document.querySelector("body");
  const props = App.generateProps(optimize);
  ReactDOM.render(<App.Component {...props} />, container);
};

main().catch((error) => {
  console.error(error);
});
