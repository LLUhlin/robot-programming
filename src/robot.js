const { getInput, writeMessageToConsole } = require('./utils');
const { ORIENTATION } = require('./consts');

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
        ], 'error');
        return false;
    }
    return true;
};

/**
 * Validate orientation.
 * 
 * @param {string} orientation - String value that should contain only one character restricted to what's inside ORIENTATION object. 
 * @returns {boolean} - Returns true or false depending on successful validation.
 */
const validateOrientation = (orientation) => {
    if (!orientation || !ORIENTATION[orientation.toUpperCase()]) {
        if (orientation) {
            writeMessageToConsole(`"${orientation}" is not a valid orientation.`, 'error');
        }
        return false;
    }
    return true;
};

/**
 * Validating and let's user re-confirm starting position on the given axis until valid input.
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
        value = await getInput(`Enter starting position on the ${axis}-axis between 0 and ${max}: `, value ? '\n' : '');
        validStart = validatePosition(value, max, axis);
    }
    return Number(value);
};

/**
 * Validating and let's user re-confirm orientation until valid input.
 * 
 * @async
 * @param {string} startOrientation - String input that looks for the chars accessable in ORIENTATION object.
 * @returns {Promise<string>} - Returns the validated string as an uppercase.
 */
const validateAndConfirmStartOrientation = async (startOrientation) => {
    let validStartOrientation = startOrientation && ORIENTATION[startOrientation.toUpperCase()];

    while (!validStartOrientation) {
        startOrientation = await getInput('Please provide a valid orientation (N / E / S / W): ', startOrientation ? '\n' : '');
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
    let startX, startY, startOrientation;

    const startPos = await getInput('Enter starting position and orientation (x y orientation): ');
    [startX, startY, startOrientation] = startPos.split(' ').filter(e => e);

    startX = await validateAndConfirmStartPosition(startX, width, 'x');
    startY = await validateAndConfirmStartPosition(startY, height, 'y');
    startOrientation = await validateAndConfirmStartOrientation(startOrientation);

    return { startX, startY, startOrientation };
};

module.exports = {
    validatePosition,
    validateOrientation,
    validateAndConfirmStartPosition,
    validateAndConfirmStartOrientation,

    getRobotPosition,

}