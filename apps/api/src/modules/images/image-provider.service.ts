import { env } from "../../config/env";

const readImageUrl = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const urls = record.urls as Record<string, unknown> | undefined;

  if (typeof record.image === "string") return record.image;
  if (typeof record.imageUrl === "string") return record.imageUrl;
  if (typeof record.url === "string") return record.url;
  if (typeof urls?.regular === "string") return urls.regular;
  if (typeof urls?.small === "string") return urls.small;

  return undefined;
};

export const resolveProductImage = async () => {
  try {
    const response = await fetch(env.externalImageApiUrl);

    if (!response.ok) {
      return env.fallbackImageUrl;
    }

    const imageUrl = readImageUrl(await response.json());
    return imageUrl || env.fallbackImageUrl;
  } catch {
    return env.fallbackImageUrl;
  }
};
