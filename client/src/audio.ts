

new AudioContext();

export const playAudio = (audio: ArrayBuffer, ended: () => void) => {
  const audioBlob = new Blob([audio], { type: 'audio/mp3' });
  const url = URL.createObjectURL(audioBlob);
  const audioElement = new Audio(url);

  audioElement.addEventListener("ended", () => {
    URL.revokeObjectURL(url);
    ended();
  });
  audioElement.play();
};