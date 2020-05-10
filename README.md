# Formality - A Mobile Education App designed for aiding learning of Formal Languages

This project is bundled as such - 3rd-year-project consists of the server files (app-backend)
and the client files (app-frontend), and canvas-test (contains the DFA tool).

#React Native: 
Starting the client - expo start (or with emulators present, yarn run -ios)
With expo start, download the Expo app on an Android or iOS device and scan the generated QR code within the terminal.

Running Jest Tests - yarn test (also see package.json for other helpful commands) or yarn test -u (for saving new Snapshots)
Jest tests may take a while to run, due to the large number of tests in the first place.
NOTE - graph in Statistics will NOT display until a question is answered correctly -> scores of 0 break the implementation of the Graph and cause a crash

#Node.js:
Startup - production = npm start
        - development = npm run dev
        - Testing = npm run test
NOTES: dotenv and .env files added, but not included within the final submission so as to NOT BREAK THE TESTS (run off separate database connection).
Also contains standardised messages for tokens (not used within this project context, can be used when Responses become more predictable).

#DFA-tool
Startup - Go to canvas-test, use expo start.
Drawing circles = single tap on the canvas.
Drawing lines = one tap on each node, and the final tap sets the line beween those two circles (same applies ot selfloop but tapping the same node thrice).

WORK FOR FUTURE:
Set up .env variables in all files and use gitignore to omit files.
Include container-based approaches
Connect the endpoint between getting questions and users made today with AdminHome and Home.
Endpoint for DELETING questions included.
Integrate tools somehow
Update AsyncStorage when new EXPO SDK releases.

