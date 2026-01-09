# :hearts: Hearts :hearts:

Welcome to **Hearts**, a classic trick-taking card game brought to life in this digital implementation! Gather your friends (or AI opponents) and enjoy the strategic and competitive gameplay of Hearts, where the goal is to avoid certain cards—or embrace them to "shoot the moon" and turn the tables on your opponents.

:warning: This game is a work in progress! There may be sections of the project structure that are incomplete or nonexistent. :warning:

## Project Structure

### `/src/game`
Framework-agnostic game engine implemented in pure TypeScript.  
Contains all Hearts rules, state transitions, scoring and cards logic, and AI behavior.

### `/src/components`
React UI layer organized by feature (Hand, Card, Trick, Scoreboard).  
Responsible only for rendering and user interaction, with no game logic.

### `/src/utils`
Generic utility functions with no game-specific assumptions.  
Reusable helpers such as shuffling, cloning, and common transformations.

### `/src/hooks`
Orchestration layer connecting the UI to the game engine.  
Manages reducer updates, turn sequencing, and AI execution.

### `/src/context`
Shared state and configuration using React Context.  
Used selectively to avoid prop drilling while keeping state flow explicit.

### `/src/assets`
Static resources including card SVGs and optional audio.  
Separated from logic and UI for clean asset management.



## Game Rules

- **Objective**: Score the fewest points by the end of the game. The game ends when a player reaches 100 points, and the player with the lowest score wins.
- **Card Values**:
  - Each heart :hearts: is worth 1 point.
  - The Queen of Spades :spades: is worth 13 points.
- **Gameplay**:
  1. Players are dealt 13 cards each.
  2. At the start of each round, players pass 3 cards to another player (left, right, across, or hold, depending on the round).
  3. The player with the 2 of Clubs :clubs: plays first.
  4. Players take turns playing one card per trick, following the suit of the first card played if possible.
  5. The player who wins the trick collects all cards and starts the next trick.
  6. Hearts :hearts: and the Queen of Spades :spades: cannot be played on the first trick.
- **Scoring**:
  - At the end of each round, players tally their points based on the cards they collected.
  - If a player collects all hearts :hearts: and the Queen of Spades :spades:, they "shoot the moon," giving 26 points to all other players instead of themselves.

Are you ready to outwit your opponents and master the art of Hearts? Let the game begin!

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.