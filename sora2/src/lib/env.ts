export const ENV = {
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || "",
  REPLICATE_MODEL: process.env.REPLICATE_MODEL || "",
};

export function hasReplicate() {
  return Boolean(ENV.REPLICATE_API_TOKEN && ENV.REPLICATE_MODEL);
}
