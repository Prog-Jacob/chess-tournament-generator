# AI Chess Tournament Generator

## Description

The AI Chess Tournament Generator is a React.js application powered by statistical modeling and optimization algorithms, specifically leveraging skewed normal distribution with genetic algorithms. The primary goal is to facilitate the creation of chess tournaments by calculating the probabilistically best tournament format. The application takes into account a number of players' recent ratings and the desired number of rounds, aiming to achieve either maximum fairness or excitement.

## Installation

The AI Chess Tournament Generator is hosted on a public GitHub repository. Make sure to have `Node` and `Git` installed beforehand. To set it up locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Prog-Jacob/chess-tournament-generator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd chess-tournament-generator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npm start
   ```

5. Access the application in your browser at `http://localhost:3000`.

## Features

- Supports three common chess formats:
  - Swiss system with 1 game per match.
  - Round Robin with 1 or 2 games per match.
  - Single Elimination Round with 2 games per match.
- Two modes:
  - Fair: Maximizes for expected results.
  - Exciting: Maximizes against expected results.
- Input options:
  - Manual input through the UI.
  - JSON file input `{ ratings?: number[], name?: string }[]`.
- Experimentation modes:
  - Generate random players on the fly.
  - Use a predefined test set of the top 20 players worldwide in classical chess as of January 2024.
- Advance through generations:
  - Advance through generations and check out how does the tournament formats and standings change over generations.

## Usage

To use the AI Chess Tournament Generator:

1. Manually input players' information or upload a JSON file.
1. Or experiment with random player generation or use the provided test set.
1. Input the desired settings through the user interface.
4. Receive the optimized tournament format for fairness or excitement.

## Contact Information

For questions or issues, feel free to reach out to [Ahmed Abdelaziz] at [Ahmed.Abdelaziz.GM@gmail.com].