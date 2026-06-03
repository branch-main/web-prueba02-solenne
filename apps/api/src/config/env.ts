import "dotenv/config";

const optional = (key: string, fallback: string) => process.env[key] || fallback;

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: optional("JWT_SECRET", "local-development-secret-change-me"),
  jwtExpiresIn: optional("JWT_EXPIRES_IN", "7d"),
  corsOrigin: optional("CORS_ORIGIN", "http://localhost:3000"),
  port: Number(optional("PORT", "4000")),
  externalImageApiUrl: optional("EXTERNAL_IMAGE_API_URL", "https://api.unsplash.com/photos/random?query=product&orientation=squarish"),
  fallbackImageUrl: optional("FALLBACK_IMAGE_URL", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop")
};
