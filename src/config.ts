export interface LibraryConfig {
  /** API URL */
  baseURL: string;
  timeout?: number;

  /* Get current access token */
  getAccessToken: () => string | null | Promise<string | null>;

  /** Get the refresh token when it needs a new one */
  getRefreshToken: () => string | null | Promise<string | null>;

  /** Callback fired when the library successfully gets new tokens from the backend */
  onTokensRefreshed: (
    accessToken: string,
    refreshToken: string,
  ) => void | Promise<void>;

  /** Fired if the user is not authenticated and refresh token fails. */
  onUnauthorized: () => void;
}

export const config: Required<LibraryConfig> = {
  baseURL: "",
  timeout: 10000,
  getAccessToken: () => null,
  getRefreshToken: () => null,
  onTokensRefreshed: () => {},
  onUnauthorized: () => {
    console.warn("Unauthorized error caught. No handler provided.");
  },
};
