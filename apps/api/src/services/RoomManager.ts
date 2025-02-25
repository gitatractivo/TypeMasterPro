import { Room } from "../models/Room";
import { User } from "../models/User";

export class RoomManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  public createRoom(text: string): Room {
    const room = new Room(text);
    this.rooms.set(room.id, room);
    return room;
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  public joinRoom(roomId: string, user: User): boolean {
    const room = this.rooms.get(roomId);
    if (room && room.users.size < 5) {
      // Limit to 5 users per room
      // @ts-ignore

      room.addUser(user);
      return true;
    }
    return false;
  }

  public leaveRoom(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.removeUser(userId);
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  public getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  public cleanupUser(user: User): void {
    if (user.roomId) {
      this.leaveRoom(user.roomId, user.id);
    }
  }
}
