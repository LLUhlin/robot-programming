const { getInput, writeMessageToConsole } = require("./utils");
const { ROOM_CONSTRAINTS, CONFIRM_INPUT } = require("./consts");

/**
 * Validate the dimension input.
 * 
 * @param {(string|numeric)} value - Input as a string or numeric, converts into a numeric for comparision, must be a round number.
 * @param {string} dimensionName - Name of dimension to be validated, must be existing in ROOM_CONSTRAINTS in order to run.
 * @throws {Error} If dimension doesn't exist in ROOM_CONSTRAINTS as key.
 * @returns {boolean} - Returns true or false depending on successful validation.
 */
const isValidDimension = (value, dimensionName) => {

    // Should never fire but includes if dimensionName is adjusted or ROOM_CONSTRAINTS object is not up to date.
    if (!ROOM_CONSTRAINTS[dimensionName]) {
        throw new Error("Invalid dimension, exiting the program.");
    }

    if (!value) {
        return false;
    }

    const parseInputAsInteger = parseInt(value);

    if (
        isNaN(parseInputAsInteger) ||
        !Number.isInteger(Number(value)) ||
        parseInputAsInteger < ROOM_CONSTRAINTS[dimensionName].min ||
        parseInputAsInteger > ROOM_CONSTRAINTS[dimensionName].max
    ) {

        writeMessageToConsole([
            `"${value}" is not a valid ${dimensionName},`,
            `must be a round number between ${ROOM_CONSTRAINTS[dimensionName].min} and ${ROOM_CONSTRAINTS[dimensionName].max}.`
        ], "error");

        return false;
    }
    return true;
};

/**
 * Validating and confirming value for dimensions until valid input.
 * 
 * @async
 * @param {(string|numeric)} value - Input as a string or numeric. 
 * @param {string} dimension - String value of the dimension that is being confirmed.
 * @returns {Promise<numeric>} - Returns a numeric value of the dimension.
 */
const validateAndConfirmValue = async (value, dimension) => {
    let validDimensionValue = isValidDimension(value, dimension);
    while (!validDimensionValue) {
        value = await getInput(`Enter ${dimension}: `, value ? "\n" : "");
        validDimensionValue = isValidDimension(value, dimension);
    }
    return Number(value);
};

/**
 * Retrieve dimensions of the room.
 * Awaits user input and once valid inputs has been given, returns the dimensions.
 * 
 * @async
 * @param {boolean} confirmBeforeContinue - Whether the program should pause for confirmation after specifying dimensions.
 * @returns {Promise<Object>} dimensions - The dimensions of the room.
 * @returns {number} dimensions.width - The width of the room.
 * @returns {number} dimensions.height - The height of the room.
 */
const getRoomDimensions = async (confirmBeforeContinue) => {
    let width, height, dimensionBlockComplete = false;

    while (!dimensionBlockComplete) {
        const roomSize = await getInput("Enter room dimensions (width height): ");
        [width, height] = roomSize.split(" ").filter(e => e);

        width = await validateAndConfirmValue(width, "width");
        height = await validateAndConfirmValue(height, "height");

        dimensionBlockComplete = !confirmBeforeContinue || await confirmDimensions(width, height);
    }

    return { width, height };
};

/**
 * Retrieve confirmation from the user.
 * Awaits user input and once valid (Y / N) based on CONFIRM_INPUT, returns true or false.
 * 
 * @async
 * @param {number} width - Width of room to be confirmed.
 * @param {number} height - Height of room to be confirmed.
 * @returns {Promise<boolean>} - Returns true or false depending on user input.
 */
const confirmDimensions = async (width, height) => {

    writeMessageToConsole(["Room dimensions", `Width: ${width}, Height: ${height}`], "success");

    while (true) {
        const confirmSize = await getInput("Confirm room dimensions (Y / N): ");
        const confirmation = confirmSize.toUpperCase().trim();
        if (CONFIRM_INPUT[confirmation] !== undefined) {
            return CONFIRM_INPUT[confirmation];
        } else {
            writeMessageToConsole("Please enter Y or N to confirm or decline room dimensions.", "error");
        }
    }
};

/**
 * Class representing a room.
 */
class Room {
    /**
     * Create a room.
     * @param {number} width - The width of the room.
     * @param {number} height - The height of the room.
     * @throws {Error} If the width or height is outside the allowed constraints.
     */
    constructor(width, height) {
        
        if (width < ROOM_CONSTRAINTS.width.min || width > ROOM_CONSTRAINTS.width.max || height < ROOM_CONSTRAINTS.height.min || height > ROOM_CONSTRAINTS.height.max) {
            throw new Error(`Invalid dimensions. Width must be between ${ROOM_CONSTRAINTS.width.min} and ${ROOM_CONSTRAINTS.width.max}, and height must be between ${ROOM_CONSTRAINTS.height.min} and ${ROOM_CONSTRAINTS.height.max}, exiting program`);
        }

        this.width = width;
        this.height = height;
    }

    /**
     * Check if a position is valid within the room dimensions.
     * @param {number} x - The x-coordinate of the position.
     * @param {number} y - The y-coordinate of the position.
     * @returns {boolean} True if the position is valid, false otherwise.
     */
    isValidPosition(x, y) {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
}

module.exports = {
    isValidDimension,
    validateAndConfirmValue,

    getRoomDimensions,
    confirmDimensions,

    Room
};