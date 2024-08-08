# Robot Programming

## Description

A Node.js application to control a robot within a defined room.

This project is a robot programming application that includes validation of room dimensions, robot starting positions, and orientations. It also confirms the dimensions and orientations through user inputs.

## Project Structure

robot-programming/
├── src/
│ ├── consts.js
│ ├── index.js
│ ├── robot.js
│ ├── room.js
│ └── utils.js
├── test/
│ ├── robot.test.js
│ └── room.test.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

### src/

- **consts.js**: Contains constants used throughout the application.
- **index.js**: The main entry point of the application.
- **robot.js**: Contains logic related to the robot's position and orientation.
- **room.js**: Contains logic related to the room's dimensions and validation.
- **utils.js**: Utility functions used by other modules.

### test/

- **robot.test.js**: Contains tests for the robot-related functions.
- **room.test.js**: Contains tests for the room-related functions.

## Installation
npm install


## Running the Application
Run the application using Node.js:

npm start

## Running Tests
Run the tests using Jest:

npm test

Run the test with open handles:

npm run devTest

## Usage

1. Run the application
    npm start
2. Follow the prompts to input the room dimensions, robot's starting position, and orientation.