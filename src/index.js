const { getRobotPosition } = require('./robot');
const { getRoomDimensions } = require('./room');
const { rl } = require('./utils');


const main = async () => {
    try {

        // Retrieve room dimensions from user input.
        const { width, height } = await getRoomDimensions();
        
        const room = { width, height };

        // Retrieve robot starting position based on room dimensions.
        const { startX, startY, startOrientation } = await getRobotPosition(room);

    } catch (error) {
        console.log(error.message);
    } finally {
        rl.close();
    }
};

main();