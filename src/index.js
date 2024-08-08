const { ROOM_CONSTRAINTS } = require("./consts");
const { getRobotPosition } = require("./robot");
const { getRoomDimensions } = require("./room");
const { rl, writeMessageToConsole } = require("./utils");

const main = async () => {
    try {
        
        writeMessageToConsole([
            "Welcome to Robot Programming!",
            "In this program we will create a room and set up a robot that can be navigated through the created space.",
            "Begin by specifying the dimensions of the room.\n",
            "Please note the following constraints of the room:",
            ...Object.entries(ROOM_CONSTRAINTS).map(([key, value]) => `${key[0].toUpperCase()}${key.substring(1)}: Min: ${value.min}, Max: ${value.max}`)
        ], "message", true);

        // Retrieve room dimensions from user input.
        const { width, height } = await getRoomDimensions();

        const room = { width, height };

        // Retrieve robot starting position based on room dimensions.
        const { startX, startY, startOrientation } = await getRobotPosition(room);

        writeMessageToConsole([
            "Room and Robot Confirmed\n",
            "Room dimensions",
            `Room width: ${width}`,
            `Room height: ${height}\n`,
            "Robot position",
            `Robot x: ${startX}`,
            `Robot y: ${startY}`,
            `Robot facing: ${startOrientation}`
        ], "message", true);

    } catch (error) {
        writeMessageToConsole(error.message, "error");
    } finally {
        rl.close();
    }
};

main();