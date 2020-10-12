import * as express from "express";

export interface Experiment {
  /**
   * 発行されたGoogle AnalyticsテストID
   */
  googleAnalyticsTestId: string;
  /**
   * Google Optimizeのテストパターンの番号
   * 0 オリジナル
   * 1 テストパターン1
   * 2 テストパターン2
   * 3 テストパターン3
   *
   * undefinedの場合、テスト対象のユーザーではない
   */
  variationId: number | undefined;
  /**
   * Google Optimizeで定義したテストパターン
   */
  validPatterns: number[];
  /**
   * 開始日時: YYYY-MM-DD hh:mm
   */
  startDate: string;
  /**
   * 終了日時: YYYY-MM-DD hh:mm
   */
  stopDate: string;
  /**
   * 想定しているテストターゲットかどうか
   */
  isTestingTarget: boolean;
}

export interface GoogleOptimizeExperiments {
  [testName: string]: Experiment;
}

const GoogleOptimizeContainerId = process.env.GOOGLE_OPTIMIZE_CONTAINER_ID;
const experiments: GoogleOptimizeExperiments = {
  testCase1: {
    googleAnalyticsTestId: "",
    validPatterns: [],
    variationId: undefined,
    startDate: "",
    stopDate: "",
    isTestingTarget: true,
  },
};

const targetCookieDomain = "";

/**
 *
 * @param startString YYYY-MM-DD hh:mm
 * @param stopString YYYY-MM-DD hh:mm
 */
export const getTestExpireParams = (
  startString: string,
  stopString: string,
): { isValidTestPeriod: boolean; maxAgeMs: number } => {
  const nowMs = Date.now();
  const startMs = new Date(startString).getTime();
  const stopMs = new Date(stopString).getTime();

  const isValidTestPeriod = nowMs - startMs >= 0 && stopMs - nowMs >= 0;
  return {
    isValidTestPeriod,
    maxAgeMs: isValidTestPeriod ? stopMs - nowMs : nowMs,
  };
};

/**
 * Google Optimizeで定義されたパターンを所持しているかどうか
 */
export const hasValidVariationId = (experiment: Experiment, variationId: number | undefined): boolean => {
  return experiment.validPatterns.some(value => variationId === value);
};

/**
 * GTMに先行してA/Bテストの状態を伝えるためのIDを生成する
 * もし、有効なテストパターンがない場合はundefinedを返す
 * `${experimentId1}.${variationId1}!${experimentId2}.${variationId2}`
 */
const generateOptimizeId = (experiments: Experiment[]): string | undefined => {
  const validExperiments = experiments.filter(exp => hasValidVariationId(exp, exp.variationId));
  if (validExperiments.length === 0) {
    return undefined;
  }
  return validExperiments.map(exp => [exp.googleAnalyticsTestId, exp.variationId].join(".")).join("!");
};

export const generateCookieId = (analyticsId: string): string => `EXP_${analyticsId}`;

/**
 * - テスト期間に対するcookieの更新処理
 * - cookieからユーザーのテスト状態を復元
 */
const updateExperimentSettings = (req: express.Request, res: express.Response, experiment: Experiment): void => {
  const cookieId = generateCookieId(experiment.googleAnalyticsTestId);
  const { maxAgeMs, isValidTestPeriod } = getTestExpireParams(experiment.startDate, experiment.stopDate);
  // テストターゲットではないもしくは、有効なテスト期間内でなければ越としないようにする
  if (!experiment.isTestingTarget || !isValidTestPeriod) {
    res.cookie(cookieId, "", {
      httpOnly: false,
      maxAge: 0,
      domain: targetCookieDomain,
    });
    experiment.variationId = undefined;
    return;
  }
  // CookieにA/Bテストのどちらのパターンか保存されている場合はそれを利用する
  const storeVariantValue = (req as any).cookies[cookieId];
  const parsedStoreValue = parseInt(storeVariantValue, 10);
  if (hasValidVariationId(experiment, parsedStoreValue)) {
    // cookieにA/Bテストの前回状態が含まれていた場合、再利用する
    experiment.variationId = parsedStoreValue; // cookieにvariantIdが保存している場合は上書きをする
  } else {
    // cookieにテスト状態が保存されていない場合、揮発期限付きでcookieをセットする
    res.cookie(cookieId, experiment.variationId, {
      httpOnly: false,
      maxAge: maxAgeMs,
      domain: "",
    });
  }
};

export const generateGoogleOptimizeParameters = (req: express.Request, res: express.Response): GoogleOptimizeData | undefined => {
  // テストパラメータの更新
  Object.values(experiments).forEach(experiment => updateExperimentSettings(req, res, experiment));
  // テストパラメーターから、Google Optimize IDの発行する(複数のテストも対応)
  const optimizeId = generateOptimizeId(Object.values(experiments));
  // どのテストも有効でない場合はoptimizeIdが発行されないため、undefinedを返す
  // 最後にreturnするのは、A/Bテストのcookieを削除するため
  if (!optimizeId) {
    return undefined;
  }
  return {
    googleOptimizeContainerId: GoogleOptimizeContainerId,
    experiments,
    optimizeId,
  };
};
