import module from 'module-alias';
module.addAliases({
  '@': __dirname,


});
import express from 'express';
import { createServer } from 'http';
import WebSocket from 'ws';
import { logger, devLogger } from '@/utils/logger';
import { RoomManager } from '@/services/RoomManager';
import { User } from '@/models/User';
import { MessageType } from '@workspace/shared/types';

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const roomManager = new RoomManager();

const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

wss.on('connection', (ws: WebSocket) => {
  let user: User | null = null;

  logger.info('New WebSocket connection established');

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      devLogger.debug({ type: data.type }, 'Received WebSocket message');

      switch (data.type) {
        case MessageType.CREATE_ROOM: {
          if (!user) {
            const room = roomManager.createRoom(data.payload.numberOfWords || 50);
            user = new User(data.payload.name, ws);
            logger.info({ userId: user.id, name: user.name }, 'New user created');
            const success = roomManager.joinRoom(room.id, user);
            if (success) {
              logger.info({ roomId: room.id, userId: user.id }, 'Room created and joined');
              user.sendMessage('room_created', { roomId: room.id });
            } else {
              user.sendMessage('error', { message: 'Failed to create room' });
            }
          }
          break;
        }

        case MessageType.JOIN_ROOM: {
          if (!user) {
            const room = roomManager.getRoom(data.payload.roomId);
            if (!room) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: { message: 'Room not found' },
                }),
              );
              break;
            }

            // Check if name is available in the room
            if (!room.isNameAvailable(data.payload.name)) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: { message: 'Name is already taken in this room' },
                }),
              );
              break;
            }

            user = new User(data.payload.name, ws);
            logger.info({ userId: user.id, name: user.name }, 'New user created');
            const success = roomManager.joinRoom(data.payload.roomId, user);
            if (!success) {
              logger.warn({ userId: user.id, roomId: data.payload.roomId }, 'Failed to join room');
              user.sendMessage('error', { message: 'Failed to join room' });
            } else {
              logger.info({ userId: user.id, roomId: data.payload.roomId }, 'User joined room');
            }
          }
          break;
        }

        case MessageType.START_GAME: {
          if (user?.roomId) {
            const room = roomManager.getRoom(user.roomId);
            if (room) {
              room.startGame(data.payload.duration);
              logger.info({ roomId: user.roomId, duration: data.payload.duration }, 'Game started');
            }
          }
          break;
        }

        case MessageType.UPDATE_PROGRESS: {
          if (user?.roomId) {
            const room = roomManager.getRoom(user.roomId);
            if (room) {
              room.updateUserProgress(
                user.id,
                data.payload.currentWordId,
                data.payload.currentCharIndex,
                data.payload.progress,
                data.payload.wpm,
              );
              devLogger.debug(
                {
                  userId: user.id,
                  roomId: user.roomId,
                  progress: data.payload.progress,
                  wpm: data.payload.wpm,
                },
                'Progress updated',
              );
            }
          }
          break;
        }
      }
    } catch (error) {
      logger.error({ err: error, message }, 'Error processing WebSocket message');
      ws.send(
        JSON.stringify({
          type: 'error',
          payload: { message: 'Invalid message format' },
        }),
      );
    }
  });

  ws.on('close', () => {
    if (user) {
      logger.info({ userId: user.id }, 'User disconnected');
      roomManager.cleanupUser(user);
    }
  });
});

server.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server started');
});
