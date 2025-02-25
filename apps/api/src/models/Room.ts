import { Room as RoomType, RoomStatus, User } from "../types";
import { v4 as uuidv4 } from "uuid";

export class Room implements RoomType {
  public id: string;
  public users: Map<string, User>;
  public status: RoomStatus;
  public text: string;
  public startTime: number | null;
  public endTime: number | null;

  constructor(text: string) {
    this.id = uuidv4();
    this.users = new Map();
    this.status = RoomStatus.WAITING;
    this.text = text;
    this.startTime = null;
    this.endTime = null;
  }

  public addUser(user: User): void {
    this.users.set(user.id, user);
    user.roomId = this.id;
    this.broadcastMessage("user_joined", {
      userId: user.id,
      userName: user.name,
      users: Array.from(this.users.values()).map((u) => ({
        id: u.id,
        name: u.name,
        progress: u.progress,
        wpm: u.wpm,
      })),
    });
  }

  public removeUser(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.roomId = null;
      this.users.delete(userId);
      this.broadcastMessage("user_left", { userId });
    }
  }

  public startGame(): void {
    this.status = RoomStatus.IN_PROGRESS;
    this.startTime = Date.now();
    this.endTime = null;
    this.broadcastMessage("game_started", {
      startTime: this.startTime,
      text: this.text,
    });
  }

  public updateUserProgress(
    userId: string,
    progress: number,
    wpm: number
  ): void {
    const user = this.users.get(userId);
    if (user) {
      // @ts-ignore

      user.updateProgress(progress, wpm);
      this.broadcastMessage('progress_update', {
        userId,
        progress,
        wpm,
      });

      if (progress === 100) {
        this.checkGameEnd();
      }
    }
  }

  private checkGameEnd(): void {
    const allFinished = Array.from(this.users.values()).every(
      (user) => user.progress === 100
    );
    if (allFinished) {
      this.endGame();
    }
  }

  private endGame(): void {
    this.status = RoomStatus.FINISHED;
    this.endTime = Date.now();
    const results = Array.from(this.users.values()).map((user) => ({
      id: user.id,
      name: user.name,
      wpm: user.wpm,
      progress: user.progress,
    }));

    this.broadcastMessage("game_finished", {
      results,
      duration: this.endTime - (this.startTime || 0),
    });
  }

  private broadcastMessage(type: string, payload: any): void {
    this.users.forEach((user) => {
      // @ts-ignore

      user.sendMessage(type, payload);
    });
  }

  public reset(): void {
    this.status = RoomStatus.WAITING;
    this.startTime = null;
    this.endTime = null;
    // @ts-ignore

    this.users.forEach((user) => user.reset());
  }
}
