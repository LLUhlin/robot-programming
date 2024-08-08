const { ROOM_CONSTRAINTS } = require("../src/consts");
const { isValidDimension, validateAndConfirmValue, getRoomDimensions, confirmDimensions } = require("../src/room");
const { getInput, rl } = require("../src/utils");

jest.mock("../src/utils");

describe("Room Functions", () => {

    afterAll(() => {
        rl.close();
    });

    describe("isValidDimension", () => {
        it("should return false if value is not provided", () => {
            expect(isValidDimension(null, "width")).toBe(false);
        });

        it("should return false if value is undefined", () => {
            expect(isValidDimension(undefined, "width")).toBe(false);
        });

        it("should return false if value is empty", () => {
            expect(isValidDimension("", "width")).toBe(false);
        });

        it("should return false if value is not a number", () => {
            expect(isValidDimension("abc", "width")).toBe(false);
        });

        it("should return false if value is a float", () => {
            expect(isValidDimension("3.5", "width")).toBe(false);
        });

        it("should return false if value is less than min", () => {
            expect(isValidDimension(ROOM_CONSTRAINTS.width.min - 1, "width")).toBe(false);
        });

        it("should return false if value is greater than max", () => {
            expect(isValidDimension(ROOM_CONSTRAINTS.width.max + 1, "width")).toBe(false);
        });

        it("should return false if value is less than min", () => {
            expect(isValidDimension(ROOM_CONSTRAINTS.height.min - 1, "height")).toBe(false);
        });

        it("should return false if value is greater than max", () => {
            expect(isValidDimension(ROOM_CONSTRAINTS.height.max + 1, "height")).toBe(false);
        });

        it("should throw error if dimension is a invalid", () => {
            expect(() => isValidDimension("5", "length")).toThrow(Error);
        });


        it("should return true if value is a valid integer within range", () => {
            expect(isValidDimension("3", "width")).toBe(true);
        });

        it("should return true if value is a valid integer within range", () => {
            expect(isValidDimension("20", "height")).toBe(true);
        });
    });

    describe("validateAndConfirmValue", () => {
        it("should validate and confirm value", async () => {
            getInput.mockResolvedValueOnce("15");
            const result = await validateAndConfirmValue(ROOM_CONSTRAINTS.width.max + 1, "width");
            expect(result).toBe(15);
        });
    });

    describe("confirmDimensions", () => {
        it("should return true for confirmation Y", async () => {
            getInput.mockResolvedValueOnce("Y");
            const result = await confirmDimensions(10, 15);
            expect(result).toBe(true);
        });

        it("should return false for confirmation N", async () => {
            getInput.mockResolvedValueOnce("N");
            const result = await confirmDimensions(10, 15);
            expect(result).toBe(false);
        });

        it("should re-prompt for invalid confirmation input", async () => {
            getInput
                .mockResolvedValueOnce("X")
                .mockResolvedValueOnce("Y");
            const result = await confirmDimensions(10, 15);
            expect(result).toBe(true);
        });

        it("should re-prompt for empty confirmation input", async () => {
            getInput
                .mockResolvedValueOnce("")
                .mockResolvedValueOnce("Y");
            const result = await confirmDimensions(10, 15);
            expect(result).toBe(true);
        });
    });

    describe("getRoomDimensions", () => {
        it("should retrieve valid room dimensions", async () => {
            getInput.mockResolvedValueOnce("15 10").mockResolvedValueOnce("Y");
            const result = await getRoomDimensions();
            expect(result).toEqual({ width: 15, height: 10 });
        });

        it("should re-prompt for dimensions if confirmation is N", async () => {
            getInput
                .mockResolvedValueOnce("10 15")
                .mockResolvedValueOnce("N")
                .mockResolvedValueOnce("12 18")
                .mockResolvedValueOnce("Y");
            const result = await getRoomDimensions();
            expect(result).toEqual({ width: 12, height: 18 });
        });

        it("should re-prompt for dimensions if dimensions are invalid", async () => {
            getInput
                .mockResolvedValueOnce(`10 ${ROOM_CONSTRAINTS.height.max + 1}`)
                .mockResolvedValueOnce("18")
                .mockResolvedValueOnce("Y");
            const result = await getRoomDimensions();
            expect(result).toEqual({ width: 10, height: 18 });
        });

        it("should re-prompt for individual dimensions if dimension is invalid", async () => {
            getInput
                .mockResolvedValueOnce(`${ROOM_CONSTRAINTS.width.min - 1} ${ROOM_CONSTRAINTS.height.max + 1}`)
                .mockResolvedValueOnce("5")
                .mockResolvedValueOnce("")
                .mockResolvedValueOnce("7")
                .mockResolvedValueOnce("Y");
            const result = await getRoomDimensions();
            expect(result).toEqual({ width: 5, height: 7 });
        });

        it("should re-prompt for confirmation if confirmation value is invalid", async () => {
            getInput
                .mockResolvedValueOnce("5 7")
                .mockResolvedValueOnce("")
                .mockResolvedValueOnce("7")
                .mockResolvedValueOnce("Y");
            const result = await getRoomDimensions();
            expect(result).toEqual({ width: 5, height: 7 });
        });
    });
});
