import { io } from "socket.io-client";
import { SOCKET_CONNECTION } from "@constants";

export const socket = io(SOCKET_CONNECTION, {
  autoConnect: false,
});
