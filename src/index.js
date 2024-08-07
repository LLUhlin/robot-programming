const { getRoomDimensions } = require('./room');
const { rl } = require('./utils');

const main = async () => {
    try {

        // Retrieve room dimensions from user input.
        const { width, height } = await getRoomDimensions();
    } catch (error) {
        console.log(error.message);
    } finally {
        rl.close();
    }
};

main();