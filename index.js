// JavaScript extracted from index.html
function login() {
  const users = {
    'guptanayan312': 'nayan@20099',
    'kavyraj312': 'kattu001',
    'pranshu312': 'pranshu2008',
    'Pujan172081': '172081',
    'mansi312': 'mansi2008'
  };
  const names = {
    'guptanayan312': 'Nayan Gupta',
    'kavyraj312': 'Kavyaraj Atodariya',
    'pranshu312': 'Pranshu Gajjar',
    'Pujan172081': 'Pujan Pandya',
    'mansi312': 'Mansi Gupta'
  };
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('message');
  const displayName = names[username] || username;
  if (users[username] && users[username] === password) {
    localStorage.setItem('userName', displayName);
    message.textContent = `Welcome, ${displayName}! Redirecting...`;
    message.style.color = '#28a745';
    setTimeout(() => {
      window.location.href = 'main.html';
    }, 1500);
  } else {
    message.textContent = '❌ Invalid username or password!';
    message.style.color = '#dc3545';
  }
}
