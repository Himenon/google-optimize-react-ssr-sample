import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { config } from "./config";
import { configure, getLogger } from "log4js";
import express from "express";
import * as path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Template from "./Template";
import * as App from "./App";
import * as Optimize from "./Optimize";

configure({
  appenders: { [config.site.title]: { type: "console" } },
  categories: { default: { appenders: [config.site.title], level: "info" } },
});

const logger = getLogger(config.site.title);

const SERVER_PORT: number = parseInt(process.env.PORT || "", 10) || 3000;

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const setMiddleware = (app: express.Application) => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(cookieParser());
};

const generateHogeOrFugaTestParams = (req: express.Request, res: express.Response, experimentId: string) => {
  const cookieId = `EXP_${experimentId}`;
  // CookieにA/Bテストのどちらのパターンか保存されている場合はそれを利用する
  const initialId = (req as any).cookies[cookieId];
  const variationId = (initialId
    ? parseInt(initialId, 10)
    : getRandomInt(2)) as Optimize.Props["hogeOrFugaVariationId"];
  if (!initialId) {
    const expireDate = new Date(); // 可能ならGoogle Optimizeの集計期間と同じにしたほうが厳格
    expireDate.setDate(expireDate.getDate() + 14); // 14日間
    res.cookie(cookieId, variationId, {
      httpOnly: true,
      expires: expireDate,
    });
  }
  return {
    experimentId,
    cookieId,
    variationId,
  };
};

export const setController = (app: express.Application) => {
  app.use("/assets", express.static(path.join(__dirname, "../dist")));
  app.use("/", (req: express.Request, res: express.Response) => {
    const hogeOrFugaParams = generateHogeOrFugaTestParams(
      req,
      res,
      config.optimize.experiment["hoge-or-fuga"].id
    );
    const appProps: App.Props = App.generateProps({
      hogeOrFugaVariationId: hogeOrFugaParams.variationId,
    });
    const templateProps: Template.Props = {
      meta: {
        title: config.site.title,
        description: config.site.description,
        analytics: {
          trackingId: config.analytics.trackingId,
          optimizeExperiments: [
            {
              experimentId: hogeOrFugaParams.experimentId,
              variationId: hogeOrFugaParams.variationId.toString(),
            },
          ],
        },
        optimize: {
          trackingId: config.optimize.trackingId,
        },
      },
      shareProps: {
        app: appProps,
        optimize: {
          hogeOrFugaVariationId: hogeOrFugaParams.variationId,
        },
      },
    };
    const html = ReactDOM.renderToStaticMarkup(
      <Template.Component {...templateProps}>
        <App.Component {...appProps} />
      </Template.Component>
    );
    res.send(html);
  });
};

const createServer = () => {
  const app = express();
  setMiddleware(app);
  setController(app);
  return app;
};

const server = createServer();

server.listen(SERVER_PORT, () => {
  logger.info(`Serve start: http://localhost:${SERVER_PORT}`);
});
