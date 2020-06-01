/**
 * Google OptimizeでA/Bテストする際に利用するパラメーター
 */
export interface Props {
  // hogeかfugaか判別するためのA/BテストのID
  hogeOrFugaVariationId: 0 | 1;
}