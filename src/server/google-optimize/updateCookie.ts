import * as express from "express";
import * as Types from "../../types";
import { domain } from "../config";

/**
 * @param startString YYYY-MM-DD hh:mm
 * @param stopString YYYY-MM-DD hh:mm
 */
export const getTestExpireParams = ({
  startDate,
  stopDate,
}: {
  startDate: string;
  stopDate: string;
}): { isValidTestPeriod: boolean; maxAgeMs: number } => {
  const nowMs = Date.now();
  const startMs = new Date(startDate).getTime();
  const stopMs = new Date(stopDate).getTime();
  const isValidTestPeriod = nowMs - startMs >= 0 && stopMs - nowMs >= 0;
  return {
    isValidTestPeriod,
    maxAgeMs: isValidTestPeriod ? stopMs - nowMs : nowMs,
  };
};

export const updateCookie = (
  req: express.Request,
  res: express.Response,
  experiment: Types.ServerSideExperimentSetting,
  variationParams: {
    cookieId: string;
    isReStoredValue: boolean;
    isValidVariationId: boolean;
    value: string | number;
  },
) => {
  const { maxAgeMs, isValidTestPeriod } = getTestExpireParams(experiment);
  // テストターゲットではない場合、もしくは、有効なテスト期間内でなければ越としないようにする
  if (!isValidTestPeriod) {
    res.cookie(variationParams.cookieId, "", {
      httpOnly: false,
      maxAge: 0,
      domain,
    });
    return;
  }
  // restoreされた値の場合、現在のcookieの状態を更新しない
  if (variationParams.isReStoredValue) {
    return;
  } else {
    // cookieにテスト状態が保存されていない場合、揮発期限付きでcookieをセットする
    res.cookie(variationParams.cookieId, variationParams.value, {
      httpOnly: false,
      maxAge: maxAgeMs,
      domain,
    });
  }
};
