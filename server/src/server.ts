import { createServer, Server } from "http";
import { setupSocketServer, type Listener, type SocketServerApiFn } from "./socket.ts";
import OpenAI from "openai";
import OpenAIWrapper from "./openai.ts";

const clientPort: number = 3000
const serverPort: number = 8080
const httpServer: Server = createServer();

const openAIWrapper = new OpenAIWrapper(new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
}));

const socketReady: SocketServerApiFn = ({ responder, addListener }) => {
  const textInputListener: Listener = async (message: string) => {
    try {
      const audio = await openAIWrapper.getSpeechResponse(message);
      responder('audio', audio);
    } catch (error: any) {
      responder('audio', error.message);
    }
  };

  addListener("message", textInputListener);
}

setupSocketServer(httpServer, clientPort, socketReady);

httpServer.listen(serverPort, () => {
  console.log(`HTTP server listening on port ${serverPort}`);
});