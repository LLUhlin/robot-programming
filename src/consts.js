// MIN and MAX value constraints.
const MIN_WIDTH = 2;
const MIN_HEIGHT = 2;
const MAX_WIDTH = 20;
const MAX_HEIGHT = 20;

// Constraints collection for MIN and MAX values, restricts dimensions to be used.
const CONSTRAINTS = {
    width: { min: MIN_WIDTH, max: MAX_WIDTH },
    height: { min: MIN_HEIGHT, max: MAX_HEIGHT }
};

// Confirmation input constant to avoid comparing strings.
const CONFIRM_INPUT = {
    Y: true,
    N: false
};

// Accepted orientation of the robot.
const ORIENTATION = {
    N: true,
    E: true,
    S: true,
    W: true
}

export default {
    CONSTRAINTS,
    CONFIRM_INPUT,
    ORIENTATION
}