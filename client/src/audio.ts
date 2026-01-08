/**
 * Simple module to receive a buffer of mp3 audio and play it
 * automatically in the browser (browser usually requires some
 * sort of interaction in a 'production' scenario, but we press
 * a button to send a message in order to 'playAudio'
 * which constitutes user interaction, so that's probably ok)
*/

const audioContext = new AudioContext();

let audioQueue: ArrayBuffer[] = [];

let playing = false;
let index = 0;

export const playAudio = async (audio: ArrayBuffer): Promise<void> => {
  const buffer = await audioContext.decodeAudioData(audio);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();

  return new Promise((resolve) => {
    source.onended = () => resolve();
  })
};

export const startAudio = async (onFinished: () => void): Promise<void> => {
  if (!playing) {
    playing = true;
    index = 0;
    while (index < audioQueue.length) {
      await playAudio(audioQueue[index]);
      index++;
    }
    playing = false;
    onFinished();
  }

  return new Promise(() => { });
}

export const resetAudioQueue = () => {
  audioQueue = [];
}

export const addAudioToQueue = (audio: ArrayBuffer, index: number) => {
  if (audioQueue[index]) {
    console.log("Audio queue index ", index, " already exists");
    return;
  }
  audioQueue[index] = audio;
};