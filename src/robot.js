const { getInput, writeMessageToConsole } = require("./utils");
const { ORIENTATION, CONFIRM_INPUT } = require("./consts");
const { Room } = require("./room");

/**
 * Validate the postition input.
 * 
 * @param {(string|numeric)} value - Input as a string or numeric, converts into a numeric for comparision, must be a round number. 
 * @param {numeric} max - Constraint of the room in one axis, value must be less than this. 
 * @param {string} axis - Axis that is being validated, writes out the axis if invalid input. 
 * @returns {boolean} - Returns true or false depending on sucessful validation.
 */
const validatePosition = (value, max, axis) => {

    if (!value) {
        return false;
    }

    const parseInputAsInteger = parseInt(value);

    if (
        isNaN(parseInputAsInteger) ||
        !Number.isInteger(Number(value)) ||
        parseInputAsInteger < 0 ||
        parseInputAsInteger > max
    ) {
        writeMessageToConsole([
            `"${value}" is not a valid starting position on the ${axis}-axis`,
            `must be a round number between 0 and ${max}`
        ], "error");
        return false;
    }
    return true;
};

/**
 * Validate orientation.
 * 
 * @param {string} orientation - String value that should contain only one character restricted to what"s inside ORIENTATION object. 
 * @returns {boolean} - Returns true or false depending on successful validation.
 */
const validateOrientation = (orientation) => {
    if (!orientation || !ORIENTATION[orientation.toUpperCase()]) {
        if (orientation) {
            writeMessageToConsole(`"${orientation}" is not a valid orientation.`, "error");
        }
        return false;
    }
    return true;
};

/**
 * Validating and let"s user re-confirm starting position on the given axis until valid input.
 * 
 * @async
 * @param {(string|numeric)} value - Input as a string or numeric. 
 * @param {numeric} max - Max value of constraints.
 * @param {string} axis - String value of the axis that is being confirmed.
 * @returns {Promise<numeric>} - Returns a numeric value of the value.
 */
const validateAndConfirmStartPosition = async (value, max, axis) => {
    let validStart = validatePosition(value, max, axis);
    while (!validStart) {
        value = await getInput(`Enter starting position on the ${axis}-axis between 0 and ${max}: `, value ? "\n" : "");
        validStart = validatePosition(value, max, axis);
    }
    return Number(value);
};

/**
 * Validating and let"s user re-confirm orientation until valid input.
 * 
 * @async
 * @param {string} startOrientation - String input that looks for the chars accessable in ORIENTATION object.
 * @returns {Promise<string>} - Returns the validated string as an uppercase.
 */
const validateAndConfirmStartOrientation = async (startOrientation) => {
    let validStartOrientation = startOrientation && ORIENTATION[startOrientation.toUpperCase()];

    while (!validStartOrientation) {
        startOrientation = await getInput("Please provide a valid orientation (N / E / S / W): ", startOrientation ? "\n" : "");
        validStartOrientation = validateOrientation(startOrientation);
    }

    return startOrientation.toUpperCase();
}

/**
 * Retrieve robot starting position based on room dimensions.
 * 
 * @async
 * @param {Object} room - Room passed in for constraints validation.
 * @returns {Promise<Object>} startPosition - The start position details of the robot.
 * @returns {numeric} startPosition.startX - The start position in x-axis.
 * @returns {numeric} startPosition.startY - The start position in y-axis.
 * @returns {string} startPosition.startOrientation - The orientation that the robit is facing.
 */
const getRobotPosition = async (room) => {

    const { width, height } = room;
    let startX, startY, startOrientation, positionBlockComplete = false;

    while (!positionBlockComplete) {
        const startPos = await getInput("Enter starting position and orientation (x y orientation): ");
        [startX, startY, startOrientation] = startPos.split(" ").filter(e => e);

        startX = await validateAndConfirmStartPosition(startX, width, "x");
        startY = await validateAndConfirmStartPosition(startY, height, "y");
        startOrientation = await validateAndConfirmStartOrientation(startOrientation);

        positionBlockComplete = await confirmPosition(startX, startY, startOrientation);
    }


    return { startX, startY, startOrientation };
};

/**
 * Confirming position of the robot
 * Awaits user input and once valid (Y / N) based on CONFIRM_INPUT, returns true or false.
 * 
 * @async
 * @param {number} x - Numeric value of the robot position in x-axis.
 * @param {number} y - Numeric value of the robot position in y-axis.
 * @param {string} orientation - String value based on accepted values: N / E / S / W
 * @returns {Promise<boolean>} - Returns true or false depending on user input.
 */
const confirmPosition = async (x, y, orientation) => {

    writeMessageToConsole(["Robot Position and Orientation", `x: ${x}, y: ${y}, Orientation: ${orientation}`], "success");

    while (true) {
        const confirmSize = await getInput("Confirm robot position and orientation (Y / N): ");
        const confirmation = confirmSize.toUpperCase().trim();
        if (CONFIRM_INPUT[confirmation] !== undefined) {
            return CONFIRM_INPUT[confirmation];
        } else {
            writeMessageToConsole("Please enter Y or N to confirm or decline robot position and orientation.", "error");
        }
    }

};

/**
 * Class representing a robot.
 */
class Robot {
    /**
     * Create a robot.
     * @param {number} x - The starting position of the robot on the x-axis within the room.
     * @param {number} y - The starting position of the robot on the y-axis within the room.
     * @param {string} orientation - The initial orientation of the robot. Accepted values: 'N' (North), 'E' (East), 'S' (South), 'W' (West).
     * @param {Room} room - The room object that defines the boundaries within which the robot can move.
     * @throws {Error} If the x or y coordinates are outside the room bounds.
     * @throws {Error} If the orientation is invalid, not one of the accepted values.
     * @throws {Error} If the room is not an instance of the Room class.
     */
    constructor(x, y, orientation, room) {

        if (x < 0 || x > room.width || y < 0 || y > room.height) {
            throw new Error('Robot is being placed out of bounds, exiting the program.')
        }
        if (!ORIENTATION[orientation]) {
            throw new Error('Invalid orientation for Robot, exiting the program.');
        }
        if (!(room instanceof Room)) {
            throw new Error('Invalid Room, robot cannot be placed, exiting the program.');
        }

        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.room = room;
    }

    /**
     * Execute a command to control the robot.
     * @param {string} command - The command to execute ('L' for left, 'R' for right, 'F' for forward).
     */
    executeCommand(command) {
        switch (command) {
            case 'L':
                this.turnLeft();
                break;
            case 'R':
                this.turnRight();
                break;
            case 'F':
                this.moveForward();
                break;
            default:
                break;
        }
    }

    /**
     * Turn the robot left (counterclockwise).
     * Updates the robot's orientation to the next one in the sequence: N -> W -> S -> E -> N.
     */
    turnLeft() {
        const orientations = ['N', 'W', 'S', 'E'];
        this.orientation = orientations[(orientations.indexOf(this.orientation) + 1) % 4];
    }

    /**
     * Turn the robot right (clockwise).
     * Updates the robot's orientation to the next one in the sequence: N -> E -> S -> W -> N.
     */
    turnRight() {
        const orientations = ['N', 'E', 'S', 'W'];
        this.orientation = orientations[(orientations.indexOf(this.orientation) + 1) % 4];
    }

    /**
     * Move the robot forward in the direction it is currently facing.
     * Updates the robot's position based on its orientation.
     * @throws {Error} If the robot moves out of the room's bounds.
     */
    moveForward() {
        switch (this.orientation) {
            case 'N':
                this.y += 1;
                break;
            case 'E':
                this.x += 1;
                break;
            case 'S':
                this.y -= 1;
                break;
            case 'W':
                this.x -= 1;
                break;
        }

        if (!this.room.isValidPosition(this.x, this.y)) {
            throw new Error('Robot moved out of bounds!');
        }
    }

    /**
     * Report the robot's current position and orientation.
     * @returns {string} The current position and orientation of the robot in the format "x y orientation".
     */
    report() {
        return `${this.x} ${this.y} ${this.orientation}`;
    }
}


module.exports = {
    validatePosition,
    validateOrientation,
    validateAndConfirmStartPosition,
    validateAndConfirmStartOrientation,

    getRobotPosition,

    Robot
}