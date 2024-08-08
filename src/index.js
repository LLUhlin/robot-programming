const { ROOM_CONSTRAINTS } = require("./consts");
const { getRobotPosition, Robot } = require("./robot");
const { getRoomDimensions, Room } = require("./room");
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

        const room = new Room(width, height);

        // Retrieve robot starting position based on room dimensions from user input.
        const { startX, startY, startOrientation } = await getRobotPosition(room);

        const robot = new Robot(startX, startY, startOrientation, room);

        writeMessageToConsole([
            "Room and Robot Confirmed\n",
            "Room dimensions",
            `Room width: ${room.width}`,
            `Room height: ${room.height}\n`,
            "Robot position",
            `Robot x: ${robot.x}`,
            `Robot y: ${robot.y}`,
            `Robot facing: ${robot.orientation}`
        ], "message", true);

    } catch (error) {
        writeMessageToConsole(error.message, "error");
    } finally {
        rl.close();
    }
};

main();