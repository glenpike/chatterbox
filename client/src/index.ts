
import { io } from "socket.io-client";
import {
  disableTextInput,
  enableTextInput,
  initializeTextInput,
  resetTextInput,
  toggleThinking,
  setErrorMessage
} from "./ui.ts";
import { playAudio } from "./audio.ts";


const socket = io("http://localhost:8080");

socket.on("connect", () => {
  enableTextInput();
});

socket.on("disconnect", () => {
  disableTextInput();
});

socket.on("audio", (data: ArrayBuffer | string) => {
  toggleThinking(false);
  if (data instanceof ArrayBuffer) {
    playAudio(data, () => {
      resetTextInput();
    })
  } else {
    setErrorMessage(`The server responded with an error: '${data}'`);
    resetTextInput();
  }
});

const textInputListener = (message: string) => {
  socket.emit("message", message);
}

initializeTextInput(textInputListener);