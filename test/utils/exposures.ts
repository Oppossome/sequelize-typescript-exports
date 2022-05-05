import { Exposure, ExposureRule } from "../../src";

export const AlwaysAllow: ExposureRule = () => {
  return Exposure.Allowed;
};

export const AlwaysDeny: ExposureRule = () => {
  return Exposure.Denied;
};
