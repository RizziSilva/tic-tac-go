import { useEffect, useState } from "react";
import { socket } from "@socket";
import { EVENTS } from "@constants";

export function useGame() {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    function handleCreateGame() {
      function handleRoomCreated(room) {
        setRoom(room);
      }

      socket.on(EVENTS.ROOM_CREATED, handleRoomCreated);

      return () => {
        socket.off(EVENTS.ROOM_CREATED, handleRoomCreated);
      };
    }

    handleCreateGame();
  }, []);

  function createRoom(isPublic) {
    socket.emit(EVENTS.CREATE_ROOM, { isPublic });
  }

  return { room, createRoom };
}
