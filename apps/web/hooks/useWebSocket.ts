import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useWebSocket = () => {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080');

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'ROOM_CREATED':
          router.push(`/room/${data.payload.roomId}`);
          break;
        case 'ROOM_JOINED':
          router.push(`/room/${data.payload.roomId}`);
          break;
        case 'ERROR':
          console.error('WebSocket error:', data.payload.message);
          break;
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [router]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  return { sendMessage };
};
