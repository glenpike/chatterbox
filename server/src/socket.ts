import { Server as SocketIOServer, Socket } from "socket.io";

export type Responder = (eventName: string, data: any) => void;
export type EventHandler = (...args: any[]) => void;
export type Listener = (eventName: string, handler: EventHandler) => void;
export interface SocketServerApi {
  responder: Responder,
  addListener: Listener
}
export type SocketServerApiFn = (api: SocketServerApi) => void;

let listeners: { eventName: string; handler: (...args: any[]) => void }[] = [];

const createResponder = (socket: Socket): Responder => (eventName: string, data: any) => {
  socket.emit(eventName, data)
}
const createAddListener = (socket: Socket): Listener => (eventName: string, handler: EventHandler) => {
  listeners.push({ eventName, handler });
  socket.on(eventName, handler);
};

const onConnection = (socket: Socket, readyCallback: SocketServerApiFn): void => {
  console.log(`socket connected ${socket.id}`);

  socket.on("disconnect", () => {
    for (const { eventName, handler } of listeners) {
      socket.off(eventName, handler);
    }
    listeners = []
    console.log(`socket disconnected ${socket.id}`);
  });

  readyCallback({ responder: createResponder(socket), addListener: createAddListener(socket) });
}

export const setupSocketServer = (httpServer: any, clientPort: number, readyCallback: SocketServerApiFn) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [`http://localhost:${clientPort}`],
      credentials: true
    }
  });

  io.on("connection", (socket) => onConnection(socket, readyCallback));
};