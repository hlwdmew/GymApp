async function handleAuth(type) {
    const username = document.getElementById('auth-user').value;
    const password = document.getElementById('auth-pass').value;
    const res = await fetch(`/${type}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if (data.status === 'success') {
        if(type === 'register') alert('Регистрация успешна!'); else await loadAppData();
    } else alert(data.msg);
}

async function loadAppData() {
    const res = await fetch('/get_data');
    const data = await res.json();
    if (data.status === 'unauthorized') {
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
    } else {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        document.getElementById('display-name').innerText = data.username;
        document.getElementById('user-visits').innerText = data.visits;

        if (data.role === 'admin') {
            document.getElementById('btn-admin').style.display = 'block';
            loadUsersForAdmin();
        }

        document.getElementById('workout-container').innerHTML = data.workouts.map(w => `
            <div class="stat-card"><b>${w.time}</b> - ${w.day}<br><h3>${w.title}</h3></div>
        `).join('');

        document.getElementById('news-container').innerHTML = data.news.map(n => `
            <div class="stat-card"><h4>${n.title}</h4><p>${n.text}</p></div>
        `).join('');
    }
}

async function loadUsersForAdmin() {
    const res = await fetch('/get_users');
    const users = await res.json();
    document.getElementById('admin-users-list').innerHTML = users.map(u => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${u.username} (${u.visits})</span>
            <button onclick="markVisit(${u.id})">+1 Визит</button>
        </div>
    `).join('');
}

async function markVisit(id) { await fetch(`/add_visit/${id}`, {method:'POST'}); loadUsersForAdmin(); loadAppData(); }
async function addWorkout() {
    const payload = {title: document.getElementById('w-title').value, time: document.getElementById('w-time').value, day: document.getElementById('w-day').value, trainer: 'Инструктор'};
    await fetch('/add_workout', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    location.reload();
}
async function addNews() {
    const payload = {title: document.getElementById('n-title').value, text: document.getElementById('n-text').value};
    await fetch('/add_news', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    location.reload();
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const btnMap = {'stats-page':'btn-stats', 'schedule':'btn-schedule', 'news':'btn-news-page', 'admin-panel':'btn-admin'};
    if (btnMap[id]) document.getElementById(btnMap[id]).classList.add('active');
}

async function logout() { await fetch('/logout'); location.reload(); }
window.onload = loadAppData;