const { validatePosition, validateOrientation, validateAndConfirmStartPosition, validateAndConfirmStartOrientation, getRobotPosition, Robot } = require("../src/robot");
const { Room } = require("../src/room");
const { getInput, rl } = require("../src/utils");

jest.mock("../src/utils");

describe("Robot Functions", () => {

    afterAll(() => {
        rl.close();
    });

    describe("validatePosition", () => {
        it("should return false if value is not provided", () => {
            expect(validatePosition(null, 5, "x")).toBe(false);
        });

        it("should return false if value is undefined", () => {
            expect(validatePosition(undefined, 5, "x")).toBe(false);
        });

        it("should return false if value is an empty string", () => {
            expect(validatePosition("", 5, "x")).toBe(false);
        });

        it("should return false if value is not a number", () => {
            expect(validatePosition("abc", 5, "x")).toBe(false);
        });

        it("should return false if value is a float", () => {
            expect(validatePosition("3.5", 5, "x")).toBe(false);
        });

        it("should return false if value is less than 0", () => {
            expect(validatePosition("-1", 5, "x")).toBe(false);
        });

        it("should return false if value is greater than max", () => {
            expect(validatePosition("6", 5, "x")).toBe(false);
        });

        it("should return true if value is a valid integer within range", () => {
            expect(validatePosition("3", 5, "x")).toBe(true);
        });
    });

    describe("validateOrientation", () => {
        it("should return false if orientation is not provided", () => {
            expect(validateOrientation(null)).toBe(false);
        });

        it("should return false if orientation is undefined", () => {
            expect(validateOrientation(undefined)).toBe(false);
        });


        it("should return false if orientation is empty", () => {
            expect(validateOrientation("")).toBe(false);
        });

        it("should return false if orientation is invalid", () => {
            expect(validateOrientation("A")).toBe(false);
        });

        it("should return true if orientation is valid", () => {
            expect(validateOrientation("N")).toBe(true);
            expect(validateOrientation("E")).toBe(true);
            expect(validateOrientation("S")).toBe(true);
            expect(validateOrientation("W")).toBe(true);
        });
    });

    describe("validateAndConfirmStartPosition", () => {
        it("should validate and confirm start position", async () => {
            getInput.mockResolvedValueOnce("3");
            const result = await validateAndConfirmStartPosition("6", 5, "x");
            expect(result).toBe(3);
        });
    });

    describe("validateAndConfirmStartOrientation", () => {
        it("should validate and confirm start orientation", async () => {
            getInput.mockResolvedValueOnce("N");
            const result = await validateAndConfirmStartOrientation("A");
            expect(result).toBe("N");
        });
    });

    describe("getRobotPosition", () => {
        it("should re-prompt for dimensions if confirmation is N", async () => {
            getInput.mockResolvedValueOnce("5 5 N")
                .mockResolvedValueOnce("N")
                .mockResolvedValueOnce("1")
                .mockResolvedValueOnce("2")
                .mockResolvedValueOnce("N")
                .mockResolvedValueOnce("Y");

            const room = { width: 5, height: 5 };
            const result = await getRobotPosition(room);

            expect(result).toEqual({ startX: 1, startY: 2, startOrientation: "N" });
        });
    });

    describe("getRobotPosition", () => {
        it("should retrieve valid robot position and orientation", async () => {
            getInput.mockResolvedValueOnce("2 4 N").mockResolvedValueOnce("Y");

            const room = { width: 5, height: 5 };
            const result = await getRobotPosition(room);

            expect(result).toEqual({ startX: 2, startY: 4, startOrientation: "N" });
        });
    });
});


describe('Robot', () => {

    let room;
    beforeEach(() => {
        room = new Room(5, 5);
    });

    describe('constructor', () => {
        it('should create a robot with valid parameters', () => {
            const robot = new Robot(1, 2, 'N', room);
            expect(robot.x).toBe(1);
            expect(robot.y).toBe(2);
            expect(robot.orientation).toBe('N');
            expect(robot.room).toBe(room);
        });

        it('should throw an error if the robot is placed out of bounds', () => {
            expect(() => new Robot(6, 2, 'N', room)).toThrow(Error);
        });

        it('should throw an error if the orientation is invalid', () => {
            expect(() => new Robot(1, 2, 'A', room)).toThrow(Error);
        });

        it('should throw an error if the room is invalid', () => {
            expect(() => new Robot(1, 2, 'N', {})).toThrow(Error);
        });
    });

    describe('executeCommand', () => {
        let robot;
        beforeEach(() => {
            robot = new Robot(1, 2, 'N', room);
        });

        it('should turn left when the command is "L"', () => {
            robot.executeCommand('L');
            expect(robot.orientation).toBe('W');
        });

        it('should turn right when the command is "R"', () => {
            robot.executeCommand('R');
            expect(robot.orientation).toBe('E');
        });

        it('should move forward when the command is "F"', () => {
            robot.executeCommand('F');
            expect(robot.x).toBe(1);
            expect(robot.y).toBe(3);
        });

        it('should throw an error if the command is invalid', () => {
            expect(() => robot.executeCommand('X')).not.toThrow();
            // X command does nothing in this context, no errors.
        });
    });

    describe('moveForward', () => {
        let robot;
        beforeEach(() => {
            robot = new Robot(1, 2, 'N', room);
        });

        it('should move north when facing north', () => {
            robot.moveForward();
            expect(robot.x).toBe(1);
            expect(robot.y).toBe(3);
        });

        it('should move east when facing east', () => {
            robot.orientation = 'E';
            robot.moveForward();
            expect(robot.x).toBe(2);
            expect(robot.y).toBe(2);
        });

        it('should move south when facing south', () => {
            robot.orientation = 'S';
            robot.moveForward();
            expect(robot.x).toBe(1);
            expect(robot.y).toBe(1);
        });

        it('should move west when facing west', () => {
            robot.orientation = 'W';
            robot.moveForward();
            expect(robot.x).toBe(0);
            expect(robot.y).toBe(2);
        });

        it('should throw an error if moving out of bounds', () => {
            robot = new Robot(0, 0, 'S', room);
            expect(() => robot.moveForward()).toThrow(Error);
        });
    });

    describe('report', () => {
        it('should report the correct position and orientation', () => {
            const robot = new Robot(1, 2, 'N', room);
            expect(robot.report()).toBe('1 2 N');
        });
    });
});