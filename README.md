# Chatterbox

A simple web-client and server that uses websockets and allows you to send text, like questions, to OpenAI and receive an audio response that plays back in the browser.

## Code & Libraries

The project is written in JavaScript/TypeScript with Node.js for the server and Vanilla TypeScript/JavaScript for the client.  

It uses [Socket IO](https://socket.io/) for server and client to avoid a lot of boilerplate code for handling websocket connections.  
The server uses raw Node libs with TypeScript configuration and wraps up the Socket functionality in a modular structure.
The client side uses [Parcel](https://parceljs.org/) for zero configuration and fast development with live reloading, etc.  I avoided using React for the UI to keep things simple and lightweight, but for making things more modular and testable, I would probably consider this route.  For a work-in-progress example React project with tests, see [the 'typescript' branch of my 'Volca' project](https://github.com/glenpike/volca/tree/typescript)

## Features

- Real-time chat via WebSockets
- Text-to-speech synthesis using OpenAI TTS
- Browser-based audio playback
- Simple and intuitive interface

## Getting Started

1. Clone the repository
2. Install dependencies for both the server and client: `cd server && npm install && cd ../client && npm install`
3. Set up environment variables for the server:  Create a file called `.env` and add an OpenAI API key like `OPENAI_API_KEY=your_api_key_here` (see `.env.test` for an example).
4. Start the server in a terminal: `cd server && npm start`
5. Start the client in another terminal: `cd client && npm start`
6. Open `http://localhost:3000` in your browser to access the client (The server runs on Port 8080)

## Testing

There are only server tests to demonstrate testing functionality using Jest.  It uses Dependency Injection for mocking OpenAI because `jest.mock("openai", ...)` was not sufficient to mock the library.

To run the tests, run `cd server && npm test`.

## Extra

Run `npm run check` in client or server folders to check the TypeScript syntax.

## ToDo

- [ ] Refactor the client to split the UI behaviour and socket messaging logic
- [ ] Consider more unit or e2e tests for the client-side UI.
- [ ] More error handling / recovery

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.