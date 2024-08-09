# Robot Programming

## Description

A Node.js application to control a robot within a defined room.

This project is a robot programming application that includes validation of room dimensions, robot starting positions, and orientations. It also confirms the dimensions and orientations through user inputs.
The robot can be moved throughout the room with a string of navigation commands and will output the last position and orientation once input is collected.

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

-  **consts.js**: Contains constants used throughout the application.
-  **index.js**: The main entry point of the application.
-  **robot.js**: Contains logic related to the robot's position and orientation.
-  **room.js**: Contains logic related to the room's dimensions and validation.
-  **utils.js**: Utility functions used by other modules.

### test/
 
-  **robot.test.js**: Contains tests for the robot-related functions.
-  **room.test.js**: Contains tests for the room-related functions.
  
## Installation

`npm install`

## Running the Application

Run the application using Node.js:

`npm start`

## Running Tests

Run the tests using Jest:

`npm test`

Run the test with open handles:

`npm run devTest`
  
## Usage

#### *Please note that this program is using `process.stdout.write("\x1Bc")` to clear your log while it's running to make it easier for user to follow*


1. Run the application

> npm start

2. Choose to continue with confirmation state or not

>  *Confirmation state let's you review your answer and confirm or go back to re-input your values*

3. Follow the prompts to input the room dimensions, robot's starting position, and orientation.

>  *If you're input is invalid or missing you'll be re-prompted to enter the value that is missing*
>  *If you have **confirmation state** active you'll have the values printed for review before continuing.*

4. Once the room and robot's position has been determined you'll get to reveiw your setup and be prompted to enter navigation commands of the robot.

> Accepted Commands:
>  -  **L**: Turn left
>  -  **R**: Turn right
>  -  **F**: Walk forward
>  
> Your input must be consecutive, for example: "RFFLFR"
>  *The program trims and converts your input so that it accepts incorrect commands and is not case-sensitive, meaning that "R a s . f F w L tfr" is the same input as the above example.*

5. Once entered you'll receive a message of the position of your robot and if out of bounds will throw an error and exit the program.

## Licence

This project is licensed under the ISC License
