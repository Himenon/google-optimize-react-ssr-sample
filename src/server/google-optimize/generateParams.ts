import * as express from "express";
import * as Types from "../../types";
import { optimizeList } from "../config";
import { updateCookie } from "./updateCookie";

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Google Optimizeで定義されたパターンを所持しているかどうか
 */
const isValidVariationId = (experiment: Types.ServerSideExperimentSetting, variationId: number | undefined): boolean => {
  return experiment.validPatterns.some(value => variationId === value);
};

const generateCookieId = (containerId: string, experiment: Types.ServerSideExperimentSetting): string => {
  return `${containerId}.${experiment.googleAnalyticsTestId}`;
};

const getVariationParams = (
  req: express.Request,
  res: express.Response,
  containerId: string,
  experiment: Types.ServerSideExperimentSetting,
) => {
  const cookieId = generateCookieId(containerId, experiment);
  const restoredValue = parseInt((req as any).cookies[cookieId]);
  const isReStoredValue = !isNaN(restoredValue);
  const value = isReStoredValue ? restoredValue : getRandomInt(Math.max(...experiment.validPatterns));
  return {
    cookieId,
    isReStoredValue,
    isValidVariationId: isValidVariationId(experiment, value),
    value,
  };
};

export const generateParams = (req: express.Request, res: express.Response): Types.GoogleOptimize[] => {
  return Object.entries(optimizeList).map(([containerId, experiments]) => {
    return {
      containerId: containerId,
      experiments: experiments.map(exp => {
        const variationParams = getVariationParams(req, res, containerId, exp);
        updateCookie(req, res, exp, variationParams); // !! 副作用
        return {
          googleAnalytics: {
            trackingId: exp.googleAnalyticsTrackingId,
            sendPageView: exp.sendPageView,
          },
          googleAnalyticsTestId: exp.googleAnalyticsTestId,
          variationId: variationParams.value,
        };
      }),
    };
  });
};
