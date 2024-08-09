const readline = require("readline");
const { CONFIRM_INPUT } = require("./consts");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const CONSOLE_COLOURS = {
    error: "\x1b[31m",
    success: "\x1b[32m",
    default: "\x1b[37m",
    message: "\x1b[36m"
}

/**
 * Retrieve user input from console.
 * 
 * @param {string} prompt - Question to be asked in console.
 * @param {string} prefix - Question will default with new line as prefix of question, can be omitted if needed or adjusted as needed.
 * @returns {Promise<string>} - Returns user input.
 */
const getInput = (prompt, prefix = "\n") => {
    return new Promise((resolve) => rl.question(`${prefix}${prompt}`, resolve));
};

/**
 * Console Log each string.
 * Will use newline on first item to keep consistency in console logs with spacing for easer read.
 * 
 * @param {(string|string[])} outputs - String or Array of strings.
 * @param {string} type - String value that takes a colour specified in CONSOLE_COLOURS for better readability of the messages in the console. Available types: "error" (red), "success" (green), "message" (cyan) and "default" (white). Default value: "default"
 * @param {boolean} clear - Specifies if console should be cleared or not before printing the message. Default value: false.
 */
const writeMessageToConsole = (outputs, type = "default", clear = false) => {
    console.log(""); // log empty string for spacing from previous message.

    if (clear) {
        process.stdout.write("\x1Bc");
    }

    if (Array.isArray(outputs)) {
        for (let i = 0; i < outputs.length; i++) {
            console.log(CONSOLE_COLOURS[type] ?? CONSOLE_COLOURS.default, outputs[i], "\x1b[0m");
        }
    } else if (typeof (outputs) === "string") {
        console.log(CONSOLE_COLOURS[type] ?? CONSOLE_COLOURS.default, outputs, "\x1b[0m");
    } else {
        console.dir(CONSOLE_COLOURS.error, `Unexpected outputs: ${outputs}`, "\x1b[0m");
    }
}

/**
 * Retrieve confirmation from the user.
 * Awaits user input and once valid (Y / N) based on CONFIRM_INPUT, returns true or false.
 * 
 * @async
 * @returns {Promise<boolean>} - Returns true or false depending on user input.
 */
const shouldConfirmBeforeContinue = async () => {
    while (true) {
        const shouldConfirm = await getInput("Would you like to confirm before moving forward when setting up the Room and the Robot? (Y / N): ");
        const confirmation = shouldConfirm.toUpperCase().trim();
        if (CONFIRM_INPUT[confirmation] !== undefined) {
            return CONFIRM_INPUT[confirmation];
        } else {
            writeMessageToConsole("Please enter Y or N to confirm or decline.", "error");
        }
    }
}

module.exports = {
    rl,
    getInput,
    writeMessageToConsole,
    shouldConfirmBeforeContinue,
};