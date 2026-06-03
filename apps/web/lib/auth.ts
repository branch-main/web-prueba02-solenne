export const tokenKey = "solenne-admin-token";

export const getToken = () => typeof window === "undefined" ? null : window.localStorage.getItem(tokenKey);
export const setToken = (token: string) => window.localStorage.setItem(tokenKey, token);
export const clearToken = () => window.localStorage.removeItem(tokenKey);
