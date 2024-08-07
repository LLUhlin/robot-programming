const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


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

module.exports = {
    getInput,
    rl
};