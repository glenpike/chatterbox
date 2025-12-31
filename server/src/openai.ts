import OpenAI from "openai";

console.log("API key:", process.env['OPENAI_API_KEY']);

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const getChatResponse = async (input: string): Promise<string> => {
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: input
  });
  console.log(response.output_text);
  return response.output_text || "";
}

const getAudioResponse = async (input: string): Promise<ArrayBuffer> => {
  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input,
  });
  const buffer = await mp3.arrayBuffer();
  return buffer;
}
const errors = {
  401: "OpenAI said 'Unauthorized' - check the OPENAI_API_KEY value is set correctly in your .env file"
}
const unknownError = "Unknown error occurred"

export const getSpeechResponse = async (input: string): Promise<ArrayBuffer> => {
  try {
    const textResponse = await getChatResponse(input);
    return await getAudioResponse(textResponse);
  } catch (error: any) {
    const message = errors[error.status as keyof typeof errors] || unknownError;
    console.log("OpenAI error:", error);
    throw new Error(message);
  }
}