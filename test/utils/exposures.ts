import { Export, ExportRule } from "../../src";

export const AlwaysAllow: ExportRule = () => {
  return Export.Allowed;
};

export const AlwaysDeny: ExportRule = () => {
  return Export.Denied;
};
