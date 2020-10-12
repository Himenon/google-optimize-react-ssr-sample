import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { config } from "./config";
import { configure, getLogger } from "log4js";
import express from "express";
import * as path from "path";
import * as Middleware from "./Middleware";
import * as Client from "../containers/App";
import * as App from "../components/App";
import * as Template from "../components/templates/Template";
import * as GoogleOptimize from "./google-optimize";

configure({
  appenders: { [config.site.title]: { type: "console" } },
  categories: { default: { appenders: [config.site.title], level: "info" } },
});

const logger = getLogger(config.site.title);

const SERVER_PORT: number = parseInt(process.env.PORT || "", 10) || 3000;

export const createController = (app: express.Application) => {
  app.use("/assets", express.static(path.join(__dirname, "../../dist")));
  app.use("/", (req: express.Request, res: express.Response) => {
    const googleOptimizeList = GoogleOptimize.generateParams(req, res);
    const clientProps: Client.Props = {
      target: {
        testCase: 1,
      },
    };
    const templateProps: Template.Props<Client.Props> = {
      meta: {
        title: config.site.title,
        description: config.site.description,
        googleOptimizeList,
      },
      clientSideRederingProps: clientProps,
    };
    const html = ReactDOM.renderToStaticMarkup(
      <Template.Component {...templateProps}>
        <App.Component {...Client.generateProps(clientProps)} />
      </Template.Component>,
    );
    res.send(html);
  });
};

const createServer = () => {
  const app = express();
  Middleware.create(app);
  createController(app);
  return app;
};

const server = createServer();

server.listen(SERVER_PORT, () => {
  logger.info(`Serve start: http://localhost:${SERVER_PORT}`);
});
