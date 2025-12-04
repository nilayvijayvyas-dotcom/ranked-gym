function renderRanking() {
    const workouts = getWorkouts();
    const musclestats = getMusclestats();

    const cardsArr = muscleOrder.map((muscle) => {
        const stat = musclestats[muscle] || { pb: 0 };
        const pb = Number(stat.pb) || 0;

        // Get current rank
        const rank = getRank(pb);

        // Find current rank index safely
        const idx = rankThresholds.findIndex(r => r.name === rank.name);

        // Determine next rank
        const nextRank = (idx >= 0 && idx < rankThresholds.length - 1)
            ? rankThresholds[idx + 1]
            : null;

        const toNext = nextRank
            ? `${nextRank.min - pb} lbs to ${nextRank.name}`
            : "Max rank!";

        // Workout count
        const workoutCount = workouts.filter(w => w.muscle === muscle).length;

        // Progress bar %
        let progress = 100;
        if (nextRank) {
            const currentMin = rank.min;
            const nextMin = nextRank.min;
            const range = nextMin - currentMin;
            progress = ((pb - currentMin) / range);
            if (progress < 0) progress = 0;
            if (progress > 100) progress = 100;
        }

        return `
<div class="muscle-card">
    <div class="muscle-card-header">
        <span class="muscle-emoji">${muscleEmojis[muscle]}</span>
        <div class="muscle-card-titlebox">
            <div class="muscle-card-title">${capitalize(muscle)}</div>
            <div class="muscle-card-subheader">${workoutCount} workout${workoutCount === 1 ? '' : 's'}</div>
        </div>
    </div>

    <div class="muscle-card-pb">Personal Best <span>${pb} lbs</span></div>

    <div class="muscle-card-progress-bar">
        <div class="muscle-card-progress-bg">
            <div class="muscle-card-progress-fill" style="width: ${(progress * 100).toFixed(1)}%"></div>
        </div>
    </div>

    <div class="muscle-card-bottom">
        <span class="${rank.color} muscle-card-rank">${rank.name.toUpperCase()}</span>
        <span class="muscle-card-next">${toNext}</span>
    </div>
</div>
`;
    });

    // Arrange 6 cards into two rows
    const cards = `
        <div class="muscle-grid">
            ${cardsArr.slice(0, 3).join('')}
        </div>
        <div class="muscle-grid">
            ${cardsArr.slice(3, 6).join('')}
        </div>
    `;

    return `
<h1>Muscle Rankings</h1>

<div class="rank-key-box">
    <div class="rank-key-title">Rank System Key</div>
    <div class="rank-key rank-key-row">
        <span class="rank-iron">Iron</span>
        <span class="rank-bronze">Bronze</span>
        <span class="rank-silver">Silver</span>
        <span class="rank-gold">Gold</span>
        <span class="rank-platinum">Platinum</span>
    </div>

    <div class="rank-key-desc">
        <span class="rank-iron">Iron</span>: Beginner |
        <span class="rank-bronze">Bronze</span>: Intermediate |
        <span class="rank-silver">Silver</span>: Advanced |
        <span class="rank-gold">Gold</span>: Elite |
        <span class="rank-platinum">Platinum</span>: Master
    </div>
</div>

<div class="stats">${cards}</div>
`;
}
