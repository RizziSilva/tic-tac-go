import { useEffect, useRef, useState } from "react";
import { socket } from "@socket";
import { EVENTS, REJOIN_ERROR_CODES } from "@constants";

export function useGame(initialRoom = null) {
  const [room, setRoom] = useState(initialRoom);
  const [error, setError] = useState(null);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);
  const pendingJoin = useRef(null);

  useEffect(() => {
    function handleRoom(room) {
      pendingJoin.current = null;
      setError(null);
      setRoom(room);
    }

    function handleOpponentDisconnected() {
      setIsOpponentDisconnected(true);
    }

    function handleOpponentReconnected() {
      setIsOpponentDisconnected(false);
    }

    function handleException(error) {
      const isRejoinPending = pendingJoin.current;
      const isRejoinError = REJOIN_ERROR_CODES.includes(error?.code);
      const shouldFallbackToJoin = isRejoinPending && isRejoinError;

      if (shouldFallbackToJoin) {
        socket.emit(EVENTS.JOIN_ROOM_WITH_CODE, pendingJoin.current);
        pendingJoin.current = null;
        return;
      }

      pendingJoin.current = null;
      setError(error);
    }

    socket.on(EVENTS.ROOM_CREATED, handleRoom);
    socket.on(EVENTS.ROOM_JOINED, handleRoom);
    socket.on(EVENTS.PLAYER_JOINED, handleRoom);
    socket.on(EVENTS.ROOM_STATE, handleRoom);
    socket.on(EVENTS.MOVE_MADE, handleRoom);
    socket.on(EVENTS.GAME_OVER, handleRoom);
    socket.on(EVENTS.OPPONENT_DISCONNECTED, handleOpponentDisconnected);
    socket.on(EVENTS.OPPONENT_RECONNECTED, handleOpponentReconnected);
    socket.on(EVENTS.EXCEPTION, handleException);

    return () => {
      socket.off(EVENTS.ROOM_CREATED, handleRoom);
      socket.off(EVENTS.ROOM_JOINED, handleRoom);
      socket.off(EVENTS.PLAYER_JOINED, handleRoom);
      socket.off(EVENTS.ROOM_STATE, handleRoom);
      socket.off(EVENTS.MOVE_MADE, handleRoom);
      socket.off(EVENTS.GAME_OVER, handleRoom);
      socket.off(EVENTS.OPPONENT_DISCONNECTED, handleOpponentDisconnected);
      socket.off(EVENTS.OPPONENT_RECONNECTED, handleOpponentReconnected);
      socket.off(EVENTS.EXCEPTION, handleException);
    };
  }, []);

  function createRoom(playerId, name, imageUrl, isPublic) {
    socket.emit(EVENTS.CREATE_ROOM, { playerId, name, imageUrl, isPublic });
  }

  function joinRoom(playerId, name, imageUrl, code) {
    socket.emit(EVENTS.JOIN_ROOM_WITH_CODE, { playerId, name, imageUrl, code });
  }

  function enterRoom(playerId, name, imageUrl, code) {
    pendingJoin.current = { playerId, name, imageUrl, code };
    socket.emit(EVENTS.REJOIN_ROOM, { playerId, code });
  }

  function play(position) {
    socket.emit(EVENTS.MOVE, { position });
  }

  function leaveRoom(playerId) {
    socket.emit(EVENTS.LEAVE_ROOM, { playerId });
  }

  return {
    room,
    error,
    isOpponentDisconnected,
    createRoom,
    joinRoom,
    enterRoom,
    play,
    leaveRoom,
  };
}
