import WebSocket from "ws";
import { User as UserType } from "../types";
import { v4 as uuidv4 } from "uuid";

export class User implements UserType {
  public id: string;
  public name: string;
  public socket: WebSocket;
  public roomId: string | null;
  public wpm: number;
  public progress: number;

  constructor(name: string, socket: WebSocket) {
    this.id = uuidv4();
    this.name = name;
    this.socket = socket;
    this.roomId = null;
    this.wpm = 0;
    this.progress = 0;
  }

  public sendMessage(type: string, payload: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  public updateProgress(progress: number, wpm: number): void {
    this.progress = progress;
    this.wpm = wpm;
  }

  public reset(): void {
    this.progress = 0;
    this.wpm = 0;
  }
}
