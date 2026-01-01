/**
 * Simple Web client for Chatterbox.
 * 
 * This client connects to the Chatterbox server via Socket.IO and provides
 * a simple text-based interface for sending messages and receiving audio responses.
 * We setup the basic Socket communication here and delegate managing the UI to a module.
*/

import { io } from "socket.io-client";
import {
  initializeUI,
  setUIState,
  UIState
} from "./ui.ts";
import { playAudio } from "./audio.ts";


const socket = io("http://localhost:8080");

socket.on("connect", () => {
  initializeUI(sendMessageHandler);
});

socket.on("disconnect", () => {
  setUIState(UIState.DISABLED);
});

socket.on("audio", async (data: ArrayBuffer | string) => {
  if (data instanceof ArrayBuffer) {
    await playAudio(data);
    setUIState(UIState.READY_FOR_INPUT);
  } else {
    setUIState(UIState.ERROR, `The server responded with an error: '${data}'`);
  }
});

const sendMessageHandler = (message: string) => {
  socket.emit("message", message);
}