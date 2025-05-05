export interface CalculationResult {
  unit: "feet" | "meters";
  area: number;
  height: number;
  pricePerUnit: number;
  subTotal: number;
  gst: number;
  total: number;
}

export interface TonnageResult {
  area: number;
  height: number;
  pricePerUnit: number;
  pricePerTon: number;
  load: number;
  subTotalPerSqFt: number;
  gstPerSqFt: number;
  totalPerSqFt: number;
  subTotalPerTon: number;
  gstPerTon: number;
  totalPerTon: number;
}
