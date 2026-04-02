import { useEffect, useState, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { config } from "../../config";
import type { ChatMessage, SendMessagePayload } from "../types/live_chat";
import type { ApiResponse } from "../../api";

export function useLiveChatWebSocket(chatId: string | null | undefined) {
  const [token, setToken] = useState<string | null>(null);

  // We need the token resolved before connecting to WebSocket
  useEffect(() => {
    if (!chatId) return;

    const fetchToken = async () => {
      const t = await config.getAccessToken();
      setToken(t);
    };
    fetchToken();
  }, [chatId]);

  // Construct WebSocket URL from the configured baseURL
  const wsUrl = () => {
    if (!config.baseURL || !chatId || !token) return null;
    try {
      const url = new URL(config.baseURL);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.pathname = `${url.pathname.replace(/\/$/, "")}/live_chat/room/${chatId}`;
      return url.toString();
    } catch {
      // If baseURL is relative (e.g. "/api"), use window location
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      return `${protocol}//${host}${config.baseURL.replace(/\/$/, "")}/live_chat/room/${chatId}`;
    }
  };

  const finalUrl = wsUrl();

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket<
    ApiResponse<ChatMessage>
  >(
    finalUrl,
    {
      // Using token as a subprotocol to pass it due to WebSocket standard not allowing custom headers in browsers.
      // E.g. Sec-WebSocket-Protocol: access_token, <token>
      protocols: token ? ["access_token", token] : [],
      shouldReconnect: (closeEvent) => {
        // Do not reconnect on unauthorized or permission denied errors
        if (
          closeEvent.code === 1008 ||
          closeEvent.code === 403 ||
          closeEvent.code === 1011
        )
          return false;
        return true;
      },
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    },
    // Only connect if we have a valid URL (meaning chat id and token exist)
    !!finalUrl,
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const sendPayload = useCallback(
    (payload: SendMessagePayload) => {
      sendMessage(JSON.stringify(payload));
    },
    [sendMessage],
  );

  return {
    sendMessage: sendPayload,
    lastMessage: lastJsonMessage?.data || null,
    rawLastMessage: lastJsonMessage,
    connectionStatus,
    readyState,
  };
}
