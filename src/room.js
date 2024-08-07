const { getInput } = require('./utils');

// MIN and MAX value constraints.
const MIN_WIDTH = 2;
const MIN_HEIGHT = 2;
const MAX_WIDTH = 20;
const MAX_HEIGHT = 20;

// Constraints collection for MIN and MAX values, restricts dimensions to be used.
const CONSTRAINTS = {
    width: { min: MIN_WIDTH, max: MAX_WIDTH },
    height: { min: MIN_HEIGHT, max: MAX_HEIGHT }
};

// Confirmation input constant to avoid comparing strings.
const CONFIRM_INPUT = {
    Y: true,
    N: false
};

/**
 * Validate the dimension input.
 * 
 * @param {string|numeric} value - Input as a string or numeric, converts into a numeric for comparision, must be a round number.
 * @param {string} dimensionName - Name of dimension to be validated, must be existing in CONSTRAINTS in order to run.
 * @returns {boolean} - Returns true or false depending on successful validation.
 */
const isValidDimension = (value, dimensionName) => {

    // Should never fire but includes if dimensionName is adjusted or CONSTRAINTS object is not up to date.
    if (!CONSTRAINTS[dimensionName]) {
        throw Error('Invalid dimension, exiting the program.');
    }

    const parseInputAsInteger = parseInt(value);
    const parseInputAsFloat = parseFloat(value);

    if (
        isNaN(parseInputAsInteger) ||
        parseInputAsInteger !== parseInputAsFloat ||
        parseInputAsInteger < CONSTRAINTS[dimensionName].min ||
        parseInputAsInteger > CONSTRAINTS[dimensionName].max
    ) {
        if (!value) {
            console.log(`Must provide a ${dimensionName}.`);
        } else {
            console.log(`"${value}" is not a valid ${dimensionName},`);
            console.log(`must be a round number between ${CONSTRAINTS[dimensionName].min} and ${CONSTRAINTS[dimensionName].max}.`);
        }

        return false;
    }
    return true;
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

        console.log('');

        const roomSize = await getInput('Enter room dimensions (width height): ');
        [width, height] = roomSize.split(' ').filter(e => e);

        if (
            !isValidDimension(width, 'width') ||
            !isValidDimension(height, 'height')
        ) {
            console.log('Try again.');
        } else {
            dimensionBlockComplete = await confirmDimensions(Number(width), Number(height));
        }
    }
    return { width: Number(width), height: Number(height) };
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

    console.log(`Width: ${width}, Height: ${height}`);

    while (true) {
        const confirmSize = await getInput('Confirm room dimensions (Y / N): ');
        const confirmation = confirmSize.toUpperCase().trim();
        if (CONFIRM_INPUT[confirmation] !== undefined) {
            return CONFIRM_INPUT[confirmation];
        } else {
            console.log('Please enter Y or N to confirm or decline room dimensions.');
        }
    }
};

module.exports = {
    isValidDimension,
    getRoomDimensions,
    confirmDimensions,
};