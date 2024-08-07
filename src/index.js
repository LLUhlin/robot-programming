const { getRobotPosition } = require('./robot');
const { getRoomDimensions } = require('./room');
const { rl, writeMessageToConsole } = require('./utils');


const main = async () => {
    try {

        // Retrieve room dimensions from user input.
        const { width, height } = await getRoomDimensions();
        
        const room = { width, height };

        // Retrieve robot starting position based on room dimensions.
        const { startX, startY, startOrientation } = await getRobotPosition(room);

    } catch (error) {
        writeMessageToConsole(error.message, 'error');
    } finally {
        rl.close();
    }
};

main();