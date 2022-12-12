import { local } from "./config/server";
import tokenIndex from "../config/token-index.json";

export function getTokenIndex(): Record<string, number> {
  if (local) {
    return tokenIndex;
  } else {
    throw new Error("Not support yet.");
  }
}
