const messageInput = document.getElementById("message-input") as HTMLInputElement;
const sendButton = document.getElementById("send-button") as HTMLButtonElement;
const toggleThinkingIndicator = document.getElementById("thinking-indicator") as HTMLParagraphElement;
const errorMessageElement = document.getElementById("error-message") as HTMLParagraphElement;

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

export const toggleThinking = (show: boolean) => {
  toggleThinkingIndicator.style.display = show ? "block" : "none";
};

export const toggleError = (show: boolean) => {
  if (!show) {
    errorMessageElement.textContent = "";
  }
  errorMessageElement.style.display = show ? "block" : "none";
};

export const resetTextInput = () => {
  messageInput.value = "";
  toggleThinking(false);
  messageInput.disabled = false;
};

export const disableTextInput = () => {
  messageInput.disabled = true;
  sendButton.disabled = true;
};

export const enableTextInput = () => {
  messageInput.disabled = false;
  sendButton.disabled = true;
};

export const setErrorMessage = (message: string) => {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
};

export const initializeTextInput = (clickHandler: (message: string) => void) => {
  disableTextInput();
  sendButton.addEventListener("click", () => {
    toggleThinking(true);
    disableTextInput();
    clickHandler(messageInput.value);
  });
}

disableTextInput()
toggleThinking(false);
