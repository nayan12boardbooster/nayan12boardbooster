// Persistent lockout state variables
let failedAttempts = 0;
let isLocked = false;
let lockoutTimer = null;
let lockoutEndTime = null;
let lockoutInterval = null;

function _0x2682(_0x16c1f0, _0x278cd7) { const _0x3e7099 = _0x3e70(); return _0x2682 = function (_0x2682de, _0x281a1f) { _0x2682de = _0x2682de - 0x6f; let _0x344a14 = _0x3e7099[_0x2682de]; return _0x344a14; }, _0x2682(_0x16c1f0, _0x278cd7); } (function (_0x457cd1, _0x3d38bd) { const _0x259b8f = _0x2682, _0x4d16cf = _0x457cd1(); while (!![]) { try { const _0x40983e = -parseInt(_0x259b8f(0x83)) / 0x1 * (parseInt(_0x259b8f(0x71)) / 0x2) + parseInt(_0x259b8f(0x7c)) / 0x3 + parseInt(_0x259b8f(0x80)) / 0x4 + parseInt(_0x259b8f(0x8b)) / 0x5 * (-parseInt(_0x259b8f(0x87)) / 0x6) + -parseInt(_0x259b8f(0x77)) / 0x7 + parseInt(_0x259b8f(0x6f)) / 0x8 + -parseInt(_0x259b8f(0x73)) / 0x9; if (_0x40983e === _0x3d38bd) break; else _0x4d16cf['push'](_0x4d16cf['shift']()); } catch (_0xe1f9fc) { _0x4d16cf['push'](_0x4d16cf['shift']()); } } }(_0x3e70, 0xeed0b));

function login() {
  // Obfuscated users object using base64 encoding
  const _usersData = [
    ['Z3VwdGFuYXlhbjMxMg==', 'bmF5YW5AMjAwOTk=', 'TmF5YW4gR3VwdGE=', 'YWN0aXZl'],
    ['YWRtaW4=', 'YWRtaW4yMDA4', 'QWRtaW4gVXNlcg==', 'YWN0aXZl'],
    ['cHJhbnNodTMxMg==', 'cHJhbnNodTIwMDg=', 'UHJhbnNodSBBamphcg==', 'YWN0aXZl'],
    ['UHVqYW4xNzIwODE=', 'MTcyMDgx', 'UHVqYW4gUGFuZHlh', 'YWN0aXZl'],
    ['ZGlzaGEzMTI=', 'ZGlzaGEyMDA4', 'RGlzaGEgQ2hyaXN0aWFu', 'YWN0aXZl']
  ];
  function _decode(x) { return atob(x); }
  let users = {};
  for (let i = 0; i < _usersData.length; i++) {
    users[_decode(_usersData[i][0])] = {
      pass: _decode(_usersData[i][1]),
      name: _decode(_usersData[i][2]),
      status: _decode(_usersData[i][3]),
      lastLogin: null
    };
  }
  const _0x4a1b = _0x2682;
  // Obfuscated DOM access
  let _dom = [
    ['getElementById','username'],
    ['getElementById','password'],
    ['getElementById','message']
  ];
  let _el = _dom.map(x => document[x[0]](x[1]));
  if (_el.some(e => !e)) {
    alert('Login form elements not found!');
    return;
  }
  let _u = _el[0][_0x4a1b(0x84)][_0x4a1b(0x8c)]();
  let _p = _el[1][_0x4a1b(0x84)][_0x4a1b(0x8c)]();
  let _m = _el[2];
  _m.textContent = '';
  _m[_0x4a1b(0x7b)]['color'] = '';

  // Check if locked out
  if (isLocked) {
    var loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.disabled = true;
    var msg = document.getElementById('loginMsg');
    var mainMsg = document.getElementById('message');
    if (lockoutEndTime) {
      let updateMsg = function() {
        let secondsLeft = Math.ceil((lockoutEndTime - Date.now()) / 1000);
        let text = 'Too many failed attempts. Try again in ' + secondsLeft + ' second' + (secondsLeft !== 1 ? 's' : '') + '.';
        if (secondsLeft > 0) {
          if (msg) msg.textContent = text;
          if (mainMsg) mainMsg.textContent = text;
        } else {
          clearInterval(lockoutInterval);
          isLocked = false;
          if (loginBtn) loginBtn.disabled = false;
          if (msg) msg.textContent = '';
          if (mainMsg) mainMsg.textContent = '';
        }
      };
      updateMsg();
      if (!lockoutInterval) {
        lockoutInterval = setInterval(updateMsg, 1000);
      }
    } else {
      let text = 'Too many failed attempts. Try again in 30 seconds.';
      if (msg) msg.textContent = text;
      if (mainMsg) mainMsg.textContent = text;
    }
    return;
  }

  function blockLoginFor30Sec() {
      isLocked = true;
      failedAttempts = 0;
      var loginBtn = document.getElementById('loginBtn');
      if (loginBtn) loginBtn.disabled = true;
      var msg = document.getElementById('loginMsg');
      var mainMsg = document.getElementById('message');
      lockoutEndTime = Date.now() + 30000;
      function updateMsg() {
          let secondsLeft = Math.ceil((lockoutEndTime - Date.now()) / 1000);
          let text = 'Too many failed attempts. Try again in ' + secondsLeft + ' second' + (secondsLeft !== 1 ? 's' : '') + '.';
          if (secondsLeft > 0) {
              if (msg) msg.textContent = text;
              if (mainMsg) mainMsg.textContent = text;
          } else {
              clearInterval(lockoutInterval);
              lockoutInterval = null;
              isLocked = false;
              if (loginBtn) loginBtn.disabled = false;
              if (msg) msg.textContent = '';
              if (mainMsg) mainMsg.textContent = '';
          }
      }
      updateMsg();
      if (lockoutInterval) clearInterval(lockoutInterval);
      lockoutInterval = setInterval(updateMsg, 1000);
      lockoutTimer = setTimeout(function() {
          isLocked = false;
          lockoutEndTime = null;
          if (lockoutInterval) { clearInterval(lockoutInterval); lockoutInterval = null; }
          if (loginBtn) loginBtn.disabled = false;
          if (msg) msg.textContent = '';
          if (mainMsg) mainMsg.textContent = '';
      }, 30000);
  }

  // Debug: Log username, password, and users object
  console.log('Input username:', _u);
  console.log('Input password:', _p);
  console.log('Users object:', users);
  // Debug: Log all usernames and the input username
  console.log('Available usernames:', Object.keys(users));
  console.log('Input username:', _u, '|', Array.from(_u).map(c => c.charCodeAt(0)));
  // Improved login logic with better error messages
  if (!users[_u]) {
    failedAttempts++;
    _m.textContent = '\u274C Invalid username!';
    _m.style.color = '#dc3545';
    return;
  }
  if (users[_u].pass === _p) {
    failedAttempts = 0;
    users[_u].lastLogin = new Date().toISOString();
    localStorage.setItem('userName', users[_u].name);
    _m.textContent = '\u2705 Welcome, ' + users[_u].name + '! Redirecting...';
    _m.style.color = '#28a745';
    setTimeout(() => { window.location.href = 'main.html'; }, 500);
  } else {
    failedAttempts++;
    if (failedAttempts >= 3) {
      blockLoginFor30Sec();
    } else {
      _m.textContent = '\u274C Invalid password! ' + (3 - failedAttempts) + ' attempt(s) left.';
      _m.style.color = '#dc3545';
    }
  }
}
function _0x3e70() { const _0x334e2a = ['\x20', 'password', 'Disha\x20Christian', 'style', '5511174kHclCW', 'getElementById', 'color', 'kattu001', '7650048eWFGty', 'main.html', '172081', '173370YskXqX', 'value', 'Pranshu\x20Gajjar', '!\x20Redirecting...', '2169438JfKwst', '\u274C\x20Invalid\x20username\x20or\x20password!', 'Nayan\x20Gupta', 'href', '20dKsWVM', 'trim', 'message', '12609440JOtxmS', 'nayan@20099', '2ggdouq', 'userName', '19731690iERhqa', 'disha2008', 'textContent', '\u2705\x20Welcome,\x20', '3748437WCiHeS']; _0x3e70 = function () { return _0x334e2a; }; return _0x3e70(); }