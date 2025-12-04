function renderDashboard() {
  const muscleOrder = (typeof window !== 'undefined' && window.muscleOrder) ? window.muscleOrder
    : ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

  const muscleEmojis = (typeof window !== 'undefined' && window.muscleEmojis) ? window.muscleEmojis
    : { chest: '💪', back: '🦴', legs: '🦵', shoulders: '🏋️', arms: '💪', core: '🧘' };

  const workouts = typeof getWorkouts === 'function' ? getWorkouts() : (window.workouts || []);
  const musclestats = typeof getMusclestats === 'function' ? getMusclestats() : (window.musclestats || {});

  // Totals
  const totalWorkouts = Array.isArray(workouts) ? workouts.length : 0;
  const totalVolume = (Array.isArray(workouts) ? workouts : []).reduce((sum, w) => {
    const weight = Number(w.weight) || 0;
    const reps = Number(w.reps) || 0;
    const sets = Number(w.sets) || 0;
    return sum + weight * reps * sets;
  }, 0);

  // Streak calculation (consecutive days with at least one log)
  let streak = 0;
  try {
    // collect unique dates (only date part)
    const dateStrings = [...new Set((workouts || []).map(w => {
      const d = new Date(w.date);
      return isNaN(d) ? null : d.toISOString().slice(0, 10);
    }).filter(Boolean))].sort().reverse(); // newest first

    if (dateStrings.length > 0) {
      let expected = new Date(dateStrings[0]); // start from newest
      streak = 0;
      for (const ds of dateStrings) {
        const d = new Date(ds);
        // difference in days between expected and d
        const diffDays = Math.round((expected - d) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          streak++;
          // move expected one day back
          expected.setDate(expected.getDate() - 1);
        } else if (diffDays < 0) {
          // future-dated entry or invalid — skip
          continue;
        } else {
          break; // streak broken
        }
      }
    }
  } catch (e) {
    streak = 0;
  }

  // Muscles trained
  const musclesTrained = [...new Set((workouts || []).map(w => w.muscle).filter(Boolean))].length;

  // Recent activity (last 5 logs)
  const recent = Array.isArray(workouts) ? workouts.slice(-5).reverse() : [];

  // Build muscle cards for muscles that have at least one workout (in muscleOrder order)
  let muscleCardsHtml = '';
  try {
    // find muscles that were trained (keeping muscleOrder order)
    const trainedMuscles = muscleOrder.filter(muscle => (workouts || []).some(w => w.muscle === muscle));

    const cardsArr = trainedMuscles.map((muscle) => {
      const stat = musclestats && musclestats[muscle] ? musclestats[muscle] : { pb: 0, workoutCount: 0 };

      // personal best (pb)
      const pb = Number(stat.pb) || 0;
      const workoutCount = Number(stat.workoutCount) || (workouts || []).filter(w => w.muscle === muscle).length;

      // Attempt to get rank info from getRank() if available
      let rank = { name: 'Iron', value: 1, color: 'tier-iron', min: 0 };
      try {
        if (typeof getRank === 'function') {
          const r = getRank(pb);
          if (typeof r === 'object' && r !== null) {
            rank.name = r.name || rank.name;
            rank.value = Number(r.value) || rank.value;
            rank.color = r.color || rank.color;
            rank.min = (typeof r.min === 'number') ? r.min : rank.min;
          } else if (typeof r === 'string') {
            rank.name = r;
          }
        }
      } catch (e) {
      }

      let toNext = 'Max rank!';
      let progressPct = 100;
      try {
        const thresholds = (typeof rankThresholds !== 'undefined' && Array.isArray(rankThresholds)) ? rankThresholds : null;

        if (thresholds && Array.isArray(thresholds)) {
          const idx = thresholds.findIndex(t => (t.name || '').toLowerCase() === (String(rank.name).toLowerCase()));
          const next = (idx >= 0 && idx < thresholds.length - 1) ? thresholds[idx + 1] : null;

          if (next) {
            const currentMin = (thresholds[idx] && typeof thresholds[idx].min === 'number') ? thresholds[idx].min : 0;
            const nextMin = (typeof next.min === 'number') ? next.min : null;
            if (nextMin !== null) {
              const lbsToNext = Math.max(0, nextMin - pb);
              toNext = `${lbsToNext} lbs to ${next.name || 'next rank'}`;
              const range = nextMin - currentMin;
              progressPct = range > 0 ? Math.min(100, Math.max(0, ((pb - currentMin) / range) * 100)) : 100;
            }
          } else {
            // no next
            toNext = 'Max rank!';
            progressPct = 100;
          }
        } else {
          if (typeof rank.value === 'number') {
            // assume next rank value is rank.value + 1
            toNext = 'Next rank info not available';
            progressPct = 100;
          }
        }
      } catch (e) {
        toNext = 'N/A';
        progressPct = 100;
      }

      const emoji = muscleEmojis[muscle] || '';
      const title = capitalize ? capitalize(muscle) : muscle.charAt(0).toUpperCase() + muscle.slice(1);

      return `
        <div class="muscle-card">
          <div class="muscle-card-header">
            <span class="muscle-emoji">${emoji}</span>
            <div class="muscle-card-titlebox">
              <div class="muscle-card-title">${title}</div>
              <div class="muscle-card-subheader">${workoutCount} workout${workoutCount === 1 ? '' : 's'}</div>
            </div>
          </div>

          <div class="muscle-card-pb">Personal Best <span>${pb} lbs</span></div>

          <div class="muscle-card-progress-bar">
            <div class="muscle-card-progress-bg">
              <div class="muscle-card-progress-fill" style="width: ${progressPct.toFixed(1)}%"></div>
            </div>
          </div>

          <div class="muscle-card-bottom">
            <span class="${rank.color || 'tier-iron'} muscle-card-rank">${(rank.name || 'Iron').toUpperCase()}</span>
            <span class="muscle-card-next">${toNext}</span>
          </div>
        </div>
      `;
    });

    // Display in rows of 3
    let rows = [];
    for (let i = 0; i < cardsArr.length; i += 3) {
      rows.push(`<div class="muscle-grid">${cardsArr.slice(i, i + 3).join('')}</div>`);
    }

    if (rows.length > 0) {
      muscleCardsHtml = `
        <div class="dashboard-muscle-cards">
          ${rows.join('')}
        </div>
      `;
    } else {
      muscleCardsHtml = `<div class="dashboard-muscle-cards"><div class="empty">No muscle data yet.</div></div>`;
    }
  } catch (e) {
    console.error('Error building muscle cards', e);
    muscleCardsHtml = `<div class="dashboard-muscle-cards"><div class="empty">Error loading muscle cards.</div></div>`;
  }

  // Recent activity HTML
  const recentHtml = (recent.length === 0) ?
    `<div class="dashboard-activity-empty">No recent activity.</div>` :
    recent.map(w => {
      const exName = (typeof formatExerciseName === 'function') ? formatExerciseName(w.exercise) : (w.exercise || 'Exercise');
      const weight = Number(w.weight) || 0;
      const reps = Number(w.reps) || 0;
      const sets = Number(w.sets) || 0;
      const muscleTitle = (typeof capitalize === 'function') ? capitalize(w.muscle) : (w.muscle ? (w.muscle.charAt(0).toUpperCase() + w.muscle.slice(1)) : '');
      return `
        <div class="dashboard-activity-item dashboard-activity-grid">
          <div class="dashboard-activity-topleft">${exName}</div>
          <div class="dashboard-activity-topright">${weight} lbs</div>
          <div class="dashboard-activity-bottomleft">${muscleTitle}</div>
          <div class="dashboard-activity-bottomright">${reps} x ${sets}</div>
        </div>
      `;
    }).join('');

  // Final dashboard HTML
  return `
    <div class="dashboard-header-row">
      <h1 class="dashboard-title">Welcome to Ranked Gym Game</h1>
      <button class="dashboard-log-btn" onclick="navigate('log')">Log Workout</button>
    </div>

    <div class="dashboard-top">
      <div class="dashboard-stats-row">
        <div class="dashboard-card">
          <div class="dashboard-card-title">Total Sessions</div>
          <div class="dashboard-card-value">${totalWorkouts}</div>
        </div>

        <div class="dashboard-card">
          <div class="dashboard-card-title">Volume Lifted</div>
          <div class="dashboard-card-value">${totalVolume} lbs</div>
        </div>

        <div class="dashboard-card dashboard-card-streak">
          <div class="dashboard-card-title">Current streak</div>
          <div class="dashboard-card-value">${streak} days</div>
        </div>

        <div class="dashboard-card">
          <div class="dashboard-card-title">Muscle Groups</div>
          <div class="dashboard-card-value">${musclesTrained}/6</div>
        </div>
      </div>
    </div>

    ${muscleCardsHtml}

    <div class="dashboard-bottom">
      <div class="dashboard-activity-title">Recent Activity</div>
      <div class="dashboard-activity-list">
        ${recentHtml}
      </div>
    </div>
  `;
}
