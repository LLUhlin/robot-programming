const { ROOM_CONSTRAINTS } = require("./consts");
const { rl, writeMessageToConsole, shouldConfirmBeforeContinue } = require("./utils");
const { getRobotPosition, Robot, moveRobotAroundTheRoom } = require("./robot");
const { getRoomDimensions, Room } = require("./room");

const main = async () => {
    try {

        writeMessageToConsole([
            "Welcome to Robot Programming!",
            "In this program we will create a room and set up a robot that can be navigated through the created space.",
            "Begin by specifying the dimensions of the room.\n",
            "Please note the following constraints of the room:",
            ...Object.entries(ROOM_CONSTRAINTS).map(([key, value]) => `${key[0].toUpperCase()}${key.substring(1)}: Min: ${value.min}, Max: ${value.max}`)
        ], "message", true);

        // Let user decide if pogram should pause for confirmation or not.
        const confirmBeforeContinue = await shouldConfirmBeforeContinue();

        // Retrieve room dimensions from user input.
        const { width, height } = await getRoomDimensions(confirmBeforeContinue);

        const room = new Room(width, height);

        // Retrieve robot starting position based on room dimensions from user input.
        const { startX, startY, startOrientation } = await getRobotPosition(room, confirmBeforeContinue);

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

        writeMessageToConsole("Room created and Robot placed inside the room", "success");

        await moveRobotAroundTheRoom(robot, confirmBeforeContinue);

    } catch (error) {
        writeMessageToConsole(error.message, "error");
    } finally {
        rl.close();
        writeMessageToConsole(["Thank you for this assignment, it was a very pleasant one and I enjoyed creating this!", "\nClosing program.\n"], "message");
    }
};

main();