const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


/**
 * Retrieve user input from console.
 * 
 * @param {string} prompt - Question to be asked in console.
 * @returns {Promise<string>} - Returns user input.
 */
const getInput = (prompt) => {
    return new Promise((resolve) => rl.question(prompt, resolve));
};

module.exports = {
    getInput,
    rl
};