const app = document.getElementById('app');
function navigate(page) {
    window.location.hash = page;
    render();
}
window.addEventListener('hashchange', render);
//  this is thee main render function
function render() {
    let page = window.location.hash.replace('#', '') || 'dashboard';
    let mainHtml = '';
    // Rendes the appropriate page
    if (page === 'dashboard') mainHtml = renderDashboard();
    else if (page === 'log') mainHtml = renderLogWorkout();
    else if (page === 'ranking') mainHtml = renderRanking();
    const current = page;
    const navBtn = (p, label) => `<button class="sidebar-btn${current === p ? ' active' : ''}" onclick="navigate('${p}')">${label}</button>`;
    // Sidebar navigation
    const sidebar = `
    <aside class="sidebar">
    <div class="sidebar-header">
    <span class="logo" aria-label="logo"> 🏋️ </span>
    <div>
    <div class="app-title">Gym Rank</div>
    <div class="app-subheader">elite Training</div>
    </div>
    </div>
    <nav>
    ${navBtn('dashboard', 'Dashboard')}
    ${navBtn('log', 'Log workout')}
    ${navBtn('ranking', 'Ranking')}
    </nav>
    </aside>
    `;
    // Renders the full layout
    app.innerHTML = `
    <div class="layout">
    ${sidebar}
    <main class="main-content">${mainHtml}</main>
    </div>
    `;
    // Setups form handlers for log workout page
    if (page === 'log') {
        setupLogWorkoutForm();
    }
}
render();
