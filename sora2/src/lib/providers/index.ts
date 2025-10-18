import { mockProvider } from "./mock";
import { replicateProvider } from "./replicate";
import { Provider } from "../types";
import { hasReplicate } from "../env";

export type RequestedProvider = "auto" | "mock" | "replicate" | undefined;

export function selectProvider(requested: RequestedProvider): Provider {
  if (requested === "mock") return mockProvider;
  if (requested === "replicate") return replicateProvider;
  // auto
  if (hasReplicate()) return replicateProvider;
  return mockProvider;
}
