function renderLogWorkout() {
    return `
<h1>Log Workout</h1>

<div class="log-box">
<form id="logForm">

    <!-- Muscle Group -->
    <div class="log-row">
        <label class="log-label log-label-long">
            <span>Muscle Group</span>
            <select name="muscle" class="log-input log-input-long">
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="legs">Legs</option>
                <option value="shoulders">Shoulders</option>
                <option value="arms">Arms</option>
                <option value="core">Core</option>
            </select>
        </label>
    </div>

    <!-- Exercise -->
    <div class="log-row">
        <label class="log-label log-label-long">
            <span>Exercise</span>
            <select name="exercise" class="log-input log-input-long">
                <option value="">Select exercise</option>
                <option value="bench_press">Bench Press</option>
                <option value="squat">Squat</option>
                <option value="deadlift">Deadlift</option>
                <option value="overhead_press">Overhead Press</option>
                <option value="barbell_row">Barbell Row</option>
                <option value="bicep_curl">Bicep Curl</option>
                <option value="tricep_extension">Tricep Extension</option>
                <option value="plank">Plank</option>
                <option value="crunch">Crunch</option>
                <option value="pullup">Pull-up</option>
                <option value="lat_raise">Lateral Raise</option>
                <option value="leg_press">Leg Press</option>
                <option value="calf_raise">Calf Raise</option>
            </select>
        </label>
    </div>

    <!-- Weight / Reps / Sets -->
    <div class="log-row log-row-3">
        <label class="log-label">
            <span>Weight (lbs)</span>
            <input type="number" name="weight" min="1" required class="log-input" />
        </label>

        <label class="log-label">
            <span>Reps</span>
            <input type="number" name="reps" min="1" required class="log-input" />
        </label>

        <label class="log-label">
            <span>Sets</span>
            <input type="number" name="sets" min="1" required class="log-input" />
        </label>
    </div>

    <!-- Date -->
    <div class="log-row">
        <label class="log-label log-label-long">
            <span>Date</span>
            <input type="date" name="date" required class="log-input log-input-long" />
        </label>
    </div>

    <!-- Notes -->
    <div class="log-row">
        <label class="log-label log-label-long">
            <span>Notes (optional)</span>
            <textarea name="notes" class="log-input log-input-long log-input-notes" rows="3" placeholder="Add any notes..."></textarea>
        </label>
    </div>

    <!-- Submit -->
    <div class="log-row log-row-center">
        <button type="submit">Submit</button>
    </div>

</form>
</div>
`;
}
function setupLogWorkoutForm() {
    const form = document.getElementById("logForm");

    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(this));

            //  this Converst from string to number
            data.weight = +data.weight;
            data.reps = +data.reps;
            data.sets = +data.sets;

            addWorkout(data);

            updateMusclePB(data.muscle, data.weight);

            // Go back to dashboard so user sees updated stats
            navigate('dashboard');
        };
    }
}
