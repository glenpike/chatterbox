import { jest, beforeEach, describe, it, expect } from "@jest/globals";
import OpenAIWrapper, { type OpenAIStub } from "../src/openai.ts";

const output_text = "test response";
const responseObject = {
  output_text
}
const buffer = Uint8Array.from([0xff, 0xee, 0xee, 0xdd]).buffer;
const mockResponse = jest.fn().mockImplementation(() => Promise.resolve(responseObject));
const mockSpeechResponse = jest.fn().mockImplementation(() => Promise.resolve({ arrayBuffer: () => buffer }));

const mockOpenAi = jest.fn().mockImplementation(() => ({
  responses: { create: mockResponse },
  audio: {
    speech: {
      create: mockSpeechResponse,
    }
  }
}));

describe("OpenAI client", () => {
  let wrapper: OpenAIWrapper;
  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = new OpenAIWrapper(mockOpenAi() as OpenAIStub);
  });

  it("should call the chat response api", async () => {
    await wrapper.getSpeechResponse("test input");
    expect(mockResponse).toHaveBeenCalledWith({ model: "gpt-4.1", input: "test input" });
  });

  it("should call the speech response api", async () => {
    await wrapper.getSpeechResponse("test input");
    expect(mockSpeechResponse).toHaveBeenCalledWith({ model: "gpt-4o-mini-tts", input: output_text, voice: "alloy" });
  });

  it("should return the audio buffer", async () => {
    const result = await wrapper.getSpeechResponse("test input");
    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result).toEqual(buffer);
  });
});
