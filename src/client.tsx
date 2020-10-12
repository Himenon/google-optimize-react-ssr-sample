import * as React from "react";
import * as ReactDOM from "react-dom";
import * as App from "./components/App";
import { generateProps, Props } from "./containers/App";

const getClientSideRenderingProps = (): Props => {
  return (window as any).__INIT_PROPS__;
};

const main = async () => {
  const cliendSideRendeinrgProps = getClientSideRenderingProps();
  const container = document.querySelector("body");
  const props = generateProps(cliendSideRendeinrgProps);
  ReactDOM.render(<App.Component {...props} />, container);
};

main().catch(error => {
  console.error(error);
});
