import * as React from "react";
import * as ReactDOM from "react-dom";
import * as App from "./components/App";
import * as Client from "./containers/App";

const getClientSideRenderingProps = (): Client.Props => {
  return (window as any).__INIT_PROPS__;
};

const main = async () => {
  const cliendSideRendeinrgProps = getClientSideRenderingProps();
  const container = document.querySelector("body");
  const props = Client.generateProps(cliendSideRendeinrgProps);
  ReactDOM.render(<App.Component {...props} />, container);
};

main().catch(error => {
  console.error(error);
});
