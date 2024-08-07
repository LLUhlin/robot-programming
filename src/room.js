const { getInput, writeMessageToConsole } = require('./utils');
const { CONSTRAINTS, CONFIRM_INPUT } = require('./consts');

/**
 * Validate the dimension input.
 * 
 * @param {(string|numeric)} value - Input as a string or numeric, converts into a numeric for comparision, must be a round number.
 * @param {string} dimensionName - Name of dimension to be validated, must be existing in CONSTRAINTS in order to run.
 * @returns {boolean} - Returns true or false depending on successful validation.
 */
const isValidDimension = (value, dimensionName) => {

    // Should never fire but includes if dimensionName is adjusted or CONSTRAINTS object is not up to date.
    if (!CONSTRAINTS[dimensionName]) {
        throw Error('Invalid dimension, exiting the program.');
    }

    const parseInputAsInteger = parseInt(value);

    if (
        isNaN(parseInputAsInteger) ||
        !Number.isInteger(Number(value)) ||
        parseInputAsInteger < CONSTRAINTS[dimensionName].min ||
        parseInputAsInteger > CONSTRAINTS[dimensionName].max
    ) {
        if (!value) {
            writeMessageToConsole(`Must provide a ${dimensionName}.`, 'error');
        } else {
            writeMessageToConsole([
                `"${value}" is not a valid ${dimensionName},`,
                `must be a round number between ${CONSTRAINTS[dimensionName].min} and ${CONSTRAINTS[dimensionName].max}.`
            ], 'error');
        }

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
        value = await getInput(`Enter ${dimension}: `);
        validDimensionValue = isValidDimension(value, dimension);
    }
    return Number(value);
};

/**
 * Retrieve dimensions of the room.
 * Awaits user input and once valid inputs has been given, returns the dimensions.
 * 
 * @async
 * @returns {Promise<Object>} dimensions - The dimensions of the room.
 * @returns {number} dimensions.width - The width of the room.
 * @returns {number} dimensions.height - The height of the room.
 */
const getRoomDimensions = async () => {
    let width, height, dimensionBlockComplete = false;

    while (!dimensionBlockComplete) {
        const roomSize = await getInput('Enter room dimensions (width height): ');
        [width, height] = roomSize.split(' ').filter(e => e);

        width = await validateAndConfirmValue(width, 'width');
        height = await validateAndConfirmValue(height, 'height');

        dimensionBlockComplete = await confirmDimensions(width, height);
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
 * @returns {Promise<boolean>} - Returns true or false depending on user input
 */
const confirmDimensions = async (width, height) => {

    writeMessageToConsole(`Width: ${width}, Height: ${height}`, 'success');

    while (true) {
        const confirmSize = await getInput('Confirm room dimensions (Y / N): ');
        const confirmation = confirmSize.toUpperCase().trim();
        if (CONFIRM_INPUT[confirmation] !== undefined) {
            return CONFIRM_INPUT[confirmation];
        } else {
            writeMessageToConsole('Please enter Y or N to confirm or decline room dimensions.', 'error');
        }
    }
};

module.exports = {
    isValidDimension,
    getRoomDimensions,
    confirmDimensions,
};