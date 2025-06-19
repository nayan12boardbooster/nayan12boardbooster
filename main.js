// JavaScript extracted from main.html
// Show logged in user's name
const userNames = {
  'guptanayan312': 'Nayan Gupta',
  'kavyraj312': 'Kavyaraj Atodariya',
  'pranshu312': 'Pranshu Gajjar',
  'Pujan172081': 'Pujan Pandya',
  'mansi312': 'Mansi Gupta'
};

const storedName = localStorage.getItem("userName");

if (storedName) {
  document.getElementById("userName").innerText = storedName;
} else {
  document.getElementById("userName").innerText = "User";
}

// Modal logic
const joinBtn = document.getElementById('joinBtn');
const batchModal = document.getElementById('batchModal');
const batchCodeInput = document.getElementById('batchCodeInput');
const batchError = document.getElementById('batchError');
const submitBatchBtn = document.getElementById('submitBatchBtn');
const closeBatchBtn = document.getElementById('closeBatchBtn');

joinBtn.onclick = function() {
  batchModal.style.display = 'flex';
  batchCodeInput.value = '';
  batchError.innerText = '';
  batchCodeInput.focus();
};
closeBatchBtn.onclick = function() {
  batchModal.style.display = 'none';
};
submitBatchBtn.onclick = function() {
  const code = batchCodeInput.value.trim();
  if (code === '12PCMNAYAN') {
    // Redirect to the correct page (studypage2.html in your workspace)
    window.location.href = 'studypage1.html';
  } else {
    batchError.innerText = 'Invalid batch code.';
  }
};
// Optional: close modal on outside click
batchModal.onclick = function(e) {
  if (e.target === batchModal) batchModal.style.display = 'none';
};
// Optional: allow Enter key to submit
batchCodeInput.onkeydown = function(e) {
  if (e.key === 'Enter') submitBatchBtn.click();
};
// Dummy logout function
function logout() {
  localStorage.removeItem('userName');
  window.location.href = 'index.html'; // Redirect to index.html on logout
}
