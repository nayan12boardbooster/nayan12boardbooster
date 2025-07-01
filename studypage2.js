// JavaScript extracted from studypage2.html

function toggleTopics(id) {
    const topics = document.getElementById(id);
    topics.style.display = (topics.style.display === "block") ? "none" : "block";
}

function logout() {
    // Redirect to login page
    window.location.href = "index.html";
}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('clock').textContent = timeStr;
}

setInterval(updateClock, 1000);
updateClock();

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');

    if (music.paused) {
        music.play();
        btn.textContent = '🔊 Pause Music';
    } else {
        music.pause();
        btn.textContent = '🔈 Play Music';
    }
}
