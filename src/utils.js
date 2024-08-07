const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const CONSOLE_COLOURS = {
    error: "\x1b[31m",
    success: "\x1b[32m",
    default: "\x1b[37m"
}

/**
 * Retrieve user input from console.
 * 
 * @param {string} prompt - Question to be asked in console.
 * @param {string} prefix - Question will default with new line as prefix of question, can be omitted if needed or adjusted as needed.
 * @returns {Promise<string>} - Returns user input.
 */
const getInput = (prompt, prefix = '\n') => {
    return new Promise((resolve) => rl.question(`${prefix}${prompt}`, resolve));
};

/**
 * Console Log each string.
 * Will use newline on first item to keep consistency in console logs with spacing for easer read.
 * 
 * @param {(string|string[])} outputs - String or Array of strings.
 * @param {string} type - String value that takes a colour specified in CONSOLE_COLOURS for better readability of the messages in the console.
 */
const writeMessageToConsole = (outputs, type = 'default') => {
    console.log(''); // log empty string for spacing from previous message.
    if (Array.isArray(outputs)) {
        for (let i = 0; i < outputs.length; i++) {
            console.log(CONSOLE_COLOURS[type] ?? CONSOLE_COLOURS.default, outputs[i], "\x1b[0m");
        }
    } else if (typeof(outputs) === 'string') {
        console.log(CONSOLE_COLOURS[type] ?? CONSOLE_COLOURS.default, outputs, "\x1b[0m");
    } else {
        console.log(CONSOLE_COLOURS.error, `Unexpected outputs: ${outputs}`, "\x1b[0m");
    }
}

module.exports = {
    rl,
    getInput,
    writeMessageToConsole,
};