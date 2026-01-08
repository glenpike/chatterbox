/**
 * UI module for managing the chat interface.
 * Handles input, buttons, thinking indicator, and error messages.
 * Provides a narrow interface for initializing, setting the state
 * and listening for when the user wants to send a message.
 */

const messageInput = document.getElementById("message-input") as HTMLInputElement;
const sendButton = document.getElementById("send-button") as HTMLButtonElement;
const toggleThinkingIndicator = document.getElementById("thinking-indicator") as HTMLParagraphElement;
const errorMessageElement = document.getElementById("error-message") as HTMLParagraphElement;

const thinkingMessages: string[] = [
  "Thinking...",
  "Hmm, this is a tricky one...",
  "I'm not sure about this one - it's a tough question!",
  "Can I call a friend?"
];
let interval: NodeJS.Timeout;

messageInput.addEventListener("input", () => {
  toggleError(false);
  if (messageInput.value.trim() !== "") {
    sendButton.disabled = false;
  } else {
    sendButton.disabled = true;
  }
});

messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

const toggleThinking = (show: boolean) => {
  toggleThinkingIndicator.style.display = show ? "block" : "none";
};

const toggleError = (show: boolean) => {
  if (!show) {
    errorMessageElement.textContent = "";
  }
  errorMessageElement.style.display = show ? "block" : "none";
};

const resetTextInput = () => {
  messageInput.value = "";
  toggleThinking(false);
  messageInput.disabled = false;
  sendButton.disabled = true;
};

const disableUI = () => {
  messageInput.disabled = true;
  sendButton.disabled = true;
};

const showErrorMessage = (message: string) => {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
};

const startThinking = () => {
  interval = setInterval(() => {
    toggleThinkingIndicator.textContent = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
  }, 2000);
}

const stopThinking = () => {
  if (interval) {
    clearInterval(interval);
  }
}

export enum UIState {
  DISABLED,
  READY_FOR_INPUT,
  SENDING_TEXT,
  PLAYING_AUDIO,
  ERROR,
}

export const setUIState = (state: UIState, errorMessage?: string) => {
  switch (state) {
    case UIState.DISABLED:
      disableUI();
      toggleThinking(false);
      break;
    case UIState.READY_FOR_INPUT:
      resetTextInput();
      stopThinking();
      break;
    case UIState.SENDING_TEXT:
      toggleThinking(true);
      startThinking();
      disableUI();
      break;
    case UIState.PLAYING_AUDIO:
      stopThinking();
      toggleThinking(false);
      break;
    case UIState.ERROR:
      showErrorMessage(errorMessage || "Unknown error occurred");
      resetTextInput();
      break;
  }
};

export const initializeUI = (sendMessageHandler: (message: string) => void) => {
  sendButton.addEventListener("click", () => {
    setUIState(UIState.SENDING_TEXT);
    sendMessageHandler(messageInput.value);
  });

  setUIState(UIState.READY_FOR_INPUT);
}

setUIState(UIState.DISABLED);
