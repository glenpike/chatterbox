/**
 * Simple wrapper for OpenAI rest calls.
 * Because we want to mock OpenAI library for
 * testing, we inject it as a dependency.
 * 
 * The wrapper provides an interface to send text to 
 * OpenAI, receive a text response, then turn this into
 * audio using the speech API.
 * 
 * Has very simple error handling to demonstrate the concept.
 */

export interface OpenAIStub {
  responses: {
    create: (args: any) => Promise<any>;
  };
  audio: {
    speech: {
      create: (args: any) => Promise<any>;
    };
  };
}

const errors = {
  401: "OpenAI said 'Unauthorized' - check the OPENAI_API_KEY value is set correctly in your .env file"
}
const unknownError = "Unknown error occurred"

class OpenAIWrapper {
  private openai: OpenAIStub;

  constructor(openai: OpenAIStub) {
    this.openai = openai;
  }

  private async getChatResponse(input: string): Promise<string> {
    const response = await this.openai.responses.create({
      model: "gpt-4.1",
      input: input
    });
    console.log("getChatResponse ", response);
    return response.output_text || "";
  }

  private async getAudioResponse(input: string): Promise<ArrayBuffer> {
    const mp3 = await this.openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input,
    });
    return await mp3.arrayBuffer();
  }

  async getSpeechResponse(input: string, onChunk: (chunk: ArrayBuffer, index: number) => void): Promise<void> {
    try {
      const textResponse = await this.getChatResponse(input);
      console.log("text response:", textResponse);
      const chunks = this.splitTextResponse(textResponse);
      let index = 0;
      for (const chunk of chunks) {
        if (chunk.trim() === "") {
          continue;
        }
        const audioResponse = await this.getAudioResponse(chunk);
        onChunk(audioResponse, index++);
      }
    } catch (error: any) {
      const message = errors[error.status as keyof typeof errors] || unknownError;
      console.log("OpenAI error:", error);
      throw new Error(message);
    }
  }

  splitTextResponse(input: string): string[] {
    // Find the next sentence after a certain length

    let chunks: string[] = input.split(".");
    return chunks;
  }
}

export default OpenAIWrapper;