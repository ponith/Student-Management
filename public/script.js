const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const message = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const countBadge = document.getElementById('countBadge');
const submitBtn = document.getElementById('submitBtn');
const formCard = document.getElementById('formCard');
const ownerToggle = document.getElementById('ownerToggle');
const ownerDetails = document.getElementById('ownerDetails');
const collegeFab = document.getElementById('collegeFab');
const collegeOverlay = document.getElementById('collegeOverlay');
const collegeClose = document.getElementById('collegeClose');

const MAX_STUDENTS = 60;
let allStudents = [];

// Prevent HTML injection from student data
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = '';
  void message.offsetWidth; // restart the animation
  message.classList.add(type, 'show');
}

function updateCount(total) {
  countBadge.textContent = `${total} / ${MAX_STUDENTS}`;
  countBadge.classList.remove('bump');
  void countBadge.offsetWidth;
  countBadge.classList.add('bump');
}

function renderTable(list) {
  tableBody.innerHTML = '';

  if (list.length === 0) {
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="6">No students found.</td></tr>';
    return;
  }

  list.forEach((s, index) => {
    const row = document.createElement('tr');
    row.style.animationDelay = `${index * 0.06}s`; // staggered entrance
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.rollNumber)}</td>
      <td>${escapeHtml(s.email) || '-'}</td>
      <td>${escapeHtml(s.age) || '-'}</td>
      <td>${escapeHtml(s.course) || '-'}</td>
    `;
    tableBody.appendChild(row);
  });
}

function applyFilter() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allStudents.filter(s =>
    [s.name, s.rollNumber, s.email, s.course]
      .some(field => (field || '').toLowerCase().includes(query))
  );
  renderTable(filtered);
}

async function loadStudents() {
  try {
    const res = await fetch('/api/students');
    allStudents = await res.json();
    updateCount(allStudents.length);
    applyFilter();
  } catch (err) {
    showMessage('Could not load students. Is the server running?', 'error');
  }
}

// Live search
searchInput.addEventListener('input', applyFilter);

// Add student
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (allStudents.length >= MAX_STUDENTS) {
    showMessage(`Limit reached: only ${MAX_STUDENTS} students allowed`, 'error');
    formCard.classList.add('shake');
    return;
  }

  const student = {
    name: document.getElementById('name').value,
    rollNumber: document.getElementById('rollNumber').value,
    email: document.getElementById('email').value,
    age: document.getElementById('age').value,
    course: document.getElementById('course').value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';

  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    const data = await res.json();

    if (res.ok) {
      showMessage('Student added successfully!', 'success');
      form.reset();
      await loadStudents();
    } else {
      showMessage(data.message || 'Error adding student', 'error');
      formCard.classList.add('shake');
    }
  } catch (err) {
    showMessage('Network error. Is the server running?', 'error');
    formCard.classList.add('shake');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Student';
  }
});

formCard.addEventListener('animationend', (e) => {
  if (e.animationName === 'shake') formCard.classList.remove('shake');
});

// Owner details toggle
ownerToggle.addEventListener('click', () => {
  const isOpen = ownerDetails.classList.toggle('show');
  ownerToggle.classList.toggle('open', isOpen);
  ownerToggle.firstChild.textContent = isOpen ? 'Hide Owner Details ' : 'Show Owner Details ';
});

// College logo: appears with animation when the user scrolls near the bottom
function updateFabVisibility() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 150;
  collegeFab.classList.toggle('visible', nearBottom);
}

window.addEventListener('scroll', updateFabVisibility, { passive: true });
window.addEventListener('resize', updateFabVisibility);

// College popup
function openCollege() {
  collegeOverlay.classList.add('show');
}

function closeCollege() {
  collegeOverlay.classList.remove('show');
}

collegeFab.addEventListener('click', openCollege);
collegeClose.addEventListener('click', closeCollege);
collegeOverlay.addEventListener('click', (e) => {
  if (e.target === collegeOverlay) closeCollege();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCollege();
});

// Button ripple effect
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// 3D tilt on cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

updateFabVisibility();
loadStudents();