import { jwtDecode, type JwtPayload } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'wisecare_access_token';
const REFRESH_TOKEN_KEY = 'wisecare_refresh_token';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Returns true if the token is expired or will expire within
   * the given buffer (default 30 seconds).
   */
  isTokenExpired(token: string, bufferSeconds = 30): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;

      const expiresAt = decoded.exp * 1000; // convert to ms
      const now = Date.now();
      return now >= expiresAt - bufferSeconds * 1000;
    } catch {
      return true;
    }
  },
} as const;
