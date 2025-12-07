let workouts = [];
let muscleStats = {
    chest: { rank: 'iron', pb: 0 },
    back: { rank: 'iron', pb: 0 },
    legs: { rank: 'iron', pb: 0 },
    shoulders: { rank: 'iron', pb: 0 },
    arms: { rank: 'iron', pb: 0 },
    core: { rank: 'iron', pb: 0 }
};
// Getter and setter functions for state
function getWorkouts() {
        return workouts;
}
function addWorkout(workout) {
    workouts.push(workout);
}

function getMusclestats() {
    return muscleStats;
}
    
function updateMusclePB(muscle, weight) {
    if (weight > muscleStats[muscle].pb) {
        muscleStats[muscle].pb = weight;
    }
}

const rankThresholds = [
    { name: "Iron",      min: 0,    color: "rank-iron" },
    { name: "Bronze",    min: 50,   color: "rank-bronze" },
    { name: "Silver",    min: 100,  color: "rank-silver" },
    { name: "Gold",      min: 200,  color: "rank-gold" },
    { name: "Platinum",  min: 300,  color: "rank-platinum" }
];


function getRank(pb) {
    let rankObj = rankThresholds[0]; // default isiron

    for (let i = 0; i < rankThresholds.length; i++) {
        if (pb >= rankThresholds[i].min) {
            rankObj = rankThresholds[i];
        }
    }
    return rankObj;
}
