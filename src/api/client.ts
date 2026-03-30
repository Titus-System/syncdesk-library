import axios, { InternalAxiosRequestConfig } from "axios";
import { config, LibraryConfig } from "../config";

export const apiClient = axios.create();

/**
 * Configure the library with user-provided settings.
 */
export const configureLibrary = (userConfig: LibraryConfig) => {
  // Overwrite the default internal config with the user's settings
  Object.assign(config, userConfig);

  apiClient.defaults.baseURL = config.baseURL;
  apiClient.defaults.timeout = config.timeout;
};

// INTERCEPTORS

/**
 * Request Interceptor.
 * Automatically adds the access token to the Authorization header of every request if it's available.
 */
apiClient.interceptors.request.use(
  async (reqConfig) => {
    const token = await config.getAccessToken();
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor.
 */
let isRefreshing = false; // Flag to prevent multiple simultaneous refresh attempts
let failedQueue: Array<{
  // Queue to hold requests that come in while we're refreshing tokens
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];
/** Processes the queue of failed requests after token refresh. */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token as string);
    }
  });
  failedQueue = [];
};

/**
 * This interceptor watches for 401 responses. If it sees one, it tries to get a new access token using
 * the refresh token.
 *
 * Meanwhile, it queues up any new requests that also fail with 401, and once it gets a new token,
 * it retries all the failed requests with the new token. If the refresh token is also expired/invalid,
 * it calls the onUnauthorized callback to let the app know they need to log in again.
 */
apiClient.interceptors.response.use(
  (response) => response, // success
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // if 401 and not retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/refresh") ||
        originalRequest.url?.includes("/login")
      ) {
        config.onUnauthorized();
        return Promise.reject(error);
      }

      // If another request is currently refreshing the token, pause this request and add to queue
      if (isRefreshing) {
        return (
          new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // on success, add the new token to the request header and return the client
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            // on error, reject the request
            .catch((err) => Promise.reject(err))
        );
      }

      // Mark that we are starting the refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await config.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available.");
        }

        // Do a standard axios call to get the new token, so the interceptors are not called again.
        const refreshResponse = await axios.post(`${config.baseURL}/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = refreshResponse.data.data.access_token;
        const newRefreshToken = refreshResponse.data.data.refresh_token;

        await config.onTokensRefreshed(newAccessToken, newRefreshToken);

        // Resume all the other paused requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request that failed
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If the refresh token is completely expired, kill the queue and log them out
        processQueue(refreshError, null);
        config.onUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
