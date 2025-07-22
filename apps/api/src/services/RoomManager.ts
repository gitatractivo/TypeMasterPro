import { Room } from '@/models/Room';
import { User } from '@/models/User';
import { logger, devLogger } from '@/utils/logger';

// TODO: Add a room manager that can be used to create, join, and leave rooms
// the job of room manager is to manage the rooms and the users in the rooms
// it should be responsible for adding and removing users from rooms
// it should also be responsible for broadcasting messages to all users in a room
// it should also be responsible for cleaning up users when they leave a room
// it should also be responsible for deleting rooms when there are no users in them
// it should also be responsible for creating rooms when a user joins a room


export class RoomManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
    logger.info('RoomManager initialized');
  }

  public createRoom(numberOfWords: number): Room {
    const room = new Room(numberOfWords);
    this.rooms.set(room.id, room);
    logger.info({ roomId: room.id }, 'New room created');
    return room;
  }

  public getRoom(roomId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    if (!room) {
      devLogger.debug({ roomId }, 'Room not found');
    }
    return room;
  }

  public joinRoom(roomId: string, user: User): boolean {
    const room = this.rooms.get(roomId);
    if (room && room.users.size < 5) {
      // Limit to 5 users per room


      room.addUser(user);
      logger.info({ roomId, userId: user.id }, 'User joined room');
      return true;
    }
    logger.warn({ roomId, userId: user.id, currentUsers: room?.users.size }, 'Failed to join room');
    return false;
  }

  public leaveRoom(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.removeUser(userId);
      logger.info({ roomId, userId }, 'User left room');
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
        logger.info({ roomId }, 'Room deleted - no users remaining');
      }
    }
  }

  public getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  public cleanupUser(user: User): void {
    if (user.roomId) {
      this.leaveRoom(user.roomId, user.id);
      logger.info({ userId: user.id }, 'User cleaned up');
    }
  }
}
