const muscleOrder = ["chest", "back", "arms", "legs", "core", "shoulders"];
const muscleEmojis = {
    chest: "💪",
    back: "🦴",
    arms: "💪",
    legs: "🦵",
    core: "🔥",
    shoulders: "🏋️‍♂️"
}

function getRank(weight) {
    let rank = rankThresholds[0];
    for (const r of rankThresholds) {
        if (weight > r.min) rank = r;
    }
    return rank;
}
// Helper to format exercise names
function formatExerciseName(exercise) {
    return exercise ? exercise.replace(/_/g, '').replace(/\b\w/g, c => c.toUpperCase()) : '';
}
// Helper to capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}