// ---------- Theme ----------
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
const SVG_MOON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const SVG_SUN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
themeToggle.innerHTML = savedTheme === 'dark' ? SVG_SUN : SVG_MOON;
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.innerHTML = next === 'dark' ? SVG_SUN : SVG_MOON;
});

// ---------- Disease info ----------
const DISEASE_INFO = {
  'Chickenpox': {
    desc: 'A highly contagious viral infection (varicella-zoster virus) that causes an itchy rash with fluid-filled blisters.',
    symptoms: ['Itchy red spots that turn into blisters', 'Fever', 'Tiredness and headache', 'Loss of appetite'],
    seek: 'Seek medical attention if the rash spreads to the eyes, fever is very high, or the skin looks infected.'
  },
  'Cowpox': {
    desc: 'A viral infection from the orthopoxvirus family, usually transmitted from animals, causing mild skin lesions.',
    symptoms: ['Sore bumps or blisters on hands/face', 'Mild fever', 'Swollen lymph nodes', 'Fatigue'],
    seek: 'Consult a doctor if lesions spread, become very painful, or are accompanied by high fever.'
  },
  'HFMD': {
    desc: 'Hand, Foot and Mouth Disease — a common viral illness, especially in young children, causing sores and a rash.',
    symptoms: ['Painful sores in the mouth', 'Rash on hands and feet', 'Fever and sore throat', 'Irritability'],
    seek: 'See a doctor if there are trouble drinking, dehydration, or high persistent fever.'
  },
  'Healthy': {
    desc: 'The analyzed skin region shows no signs of the six conditions covered by this model.',
    symptoms: ['Normal skin appearance', 'No visible lesions or rash'],
    seek: 'If you notice new spots, changes, or symptoms, please consult a healthcare professional.'
  },
  'Measles': {
    desc: 'A highly contagious viral infection causing a skin rash, fever, and respiratory symptoms.',
    symptoms: ['Red blotchy rash spreading over the body', 'High fever', 'Cough and runny nose', 'Red, watery eyes'],
    seek: 'Seek medical care if there is difficulty breathing, severe dehydration, or symptoms worsen.'
  },
  'Mpox': {
    desc: 'A viral disease (monkeypox) that causes a distinctive skin rash along with flu-like symptoms.',
    symptoms: ['Rash or skin lesions', 'Fever and headache', 'Muscle aches', 'Swollen lymph nodes'],
    seek: 'Consult a healthcare professional if a rash appears or flu-like symptoms develop.'
  }
};

// ---------- Supported condition cards ----------
const conditionCards = document.getElementById('conditionCards');
const SVG_DROP = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>';
Object.keys(DISEASE_INFO).forEach(name => {
  const card = document.createElement('div');
  card.className = 'cond-card';
  card.innerHTML = `<span class="cond-ic">${SVG_DROP}</span><h4>${name}</h4>`;
  card.addEventListener('click', () => showConditionInfo(name));
  conditionCards.appendChild(card);
});

const conditionInfo = document.getElementById('conditionInfo');
function showConditionInfo(name) {
  const d = DISEASE_INFO[name];
  conditionInfo.innerHTML = `
    <h3>${name}</h3>
    <p>${d.desc}</p>
    <h4>Common Symptoms</h4>
    <ul>${d.symptoms.map(s => `<li>${s}</li>`).join('')}</ul>
    <h4>When to Seek Medical Attention</h4>
    <p>${d.seek}</p>
    <p class="disclaimer-inline">General educational information only — not a diagnosis.</p>`;
  conditionInfo.hidden = false;
  conditionInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- Upload ----------
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const cameraInput = document.getElementById('cameraInput');
const uploadError = document.getElementById('uploadError');
const previewArea = document.getElementById('previewArea');
const previewImg = document.getElementById('previewImg');
const fileName = document.getElementById('fileName');
const fileDims = document.getElementById('fileDims');
const analyzeBtn = document.getElementById('analyzeBtn');
const removeBtn = document.getElementById('removeBtn');
const analyzing = document.getElementById('analyzing');
const result = document.getElementById('result');
const againBtn = document.getElementById('againBtn');

let currentFile = null;
let currentDataURL = null;

uploadBox.addEventListener('click', e => {
  if (e.target.closest('button')) return;
  uploadChoice.hidden = !uploadChoice.hidden;
});
const uploadChoice = document.getElementById('uploadChoice');
document.getElementById('cameraBtn').addEventListener('click', e => { e.stopPropagation(); uploadChoice.hidden = true; cameraInput.click(); });
document.getElementById('galleryBtn').addEventListener('click', e => { e.stopPropagation(); uploadChoice.hidden = true; fileInput.click(); });
uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('drag'); });
uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('drag'));
uploadBox.addEventListener('drop', e => {
  e.preventDefault();
  uploadBox.classList.remove('drag');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });
cameraInput.addEventListener('change', () => {
  if (!cameraInput.files.length) return;
  const f = cameraInput.files[0];
  const extOk = /\.(jpe?g|png)$/i.test(f.name);
  if (extOk) { handleFile(f); return; }
  const wrapped = new File([f], `camera_photo.${f.type === 'image/png' ? 'png' : 'jpg'}`, { type: f.type || 'image/jpeg' });
  handleFile(wrapped);
});
removeBtn.addEventListener('click', resetUpload);
againBtn.addEventListener('click', () => { resetUpload(); result.hidden = true; window.scrollTo({ top: 0, behavior: 'smooth' }); });

function handleFile(file) {
  uploadError.hidden = true;
  const okExt = /\.(jpe?g|png)$/i.test(file.name);
  if (!okExt) { showError('Error: Please upload a JPG, JPEG, or PNG image.'); return; }
  if (file.size > 10 * 1024 * 1024) { showError('Error: File is too large. Maximum size is 10 MB.'); return; }
  if (!file.type.startsWith('image/')) { showError('Error: The selected file is not an image.'); return; }
  currentFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    currentDataURL = e.target.result;
    previewImg.src = currentDataURL;
    const img = new Image();
    img.onload = () => { fileDims.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`; };
    img.src = currentDataURL;
    fileName.textContent = file.name;
    uploadBox.hidden = true;
    previewArea.hidden = false;
  };
  reader.readAsDataURL(file);
}

function showError(msg) { uploadError.textContent = msg; uploadError.hidden = false; }
function resetUpload() {
  currentFile = null; currentDataURL = null;
  fileInput.value = '';
  cameraInput.value = '';
  uploadChoice.hidden = true;
  previewArea.hidden = true; uploadBox.hidden = false;
  uploadError.hidden = true;
}

// ---------- Analyze ----------
analyzeBtn.addEventListener('click', async () => {
  if (!currentFile) return;
  previewArea.hidden = true;
  analyzing.hidden = false;
  const steps = document.querySelectorAll('#analyzeSteps li');
  steps.forEach(s => s.classList.remove('active'));
  let i = 0;
  const timer = setInterval(() => {
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    i = (i + 1) % steps.length;
  }, 900);
  analyzing.scrollIntoView({ behavior: 'smooth' });
  try {
    const form = new FormData();
    form.append('file', currentFile);
    const res = await fetch('/predict', { method: 'POST', body: form });
    const data = await res.json();
    clearInterval(timer);
    analyzing.hidden = true;
    if (!res.ok) { showError('Error: ' + (data.detail || 'Prediction failed.')); uploadBox.hidden = false; previewArea.hidden = false; return; }
    renderResult(data);
  } catch (err) {
    clearInterval(timer);
    analyzing.hidden = true;
    showError('Error: Could not reach the server. Make sure the backend is running.');
    previewArea.hidden = false;
  }
});

// ---------- Result ----------
function renderResult(data) {
  const pct = (data.confidence * 100);
  document.getElementById('resultImg').src = currentDataURL;
  document.getElementById('predName').textContent = data.prediction.toUpperCase();
  document.getElementById('predConf').textContent = `Confidence: ${pct.toFixed(2)}%`;

  const badge = document.getElementById('confBadge');
  const warning = document.getElementById('confWarning');
  if (pct >= 80) {
    badge.textContent = 'CONFIDENCE: HIGH'; badge.className = 'badge high';
    warning.textContent = 'Model confidence is high. This is still not a medical diagnosis.';
  } else if (pct >= 50) {
    badge.textContent = 'CONFIDENCE: MODERATE'; badge.className = 'badge moderate';
    warning.textContent = 'The model is moderately confident. Consider professional evaluation.';
  } else {
    badge.textContent = 'CONFIDENCE: LOW'; badge.className = 'badge low';
    warning.textContent = 'The model has low confidence. The result should not be relied upon.';
  }

  const bars = document.getElementById('probBars');
  bars.innerHTML = '';
  const entries = Object.entries(data.probabilities).sort((a, b) => b[1] - a[1]);
  entries.forEach(([name, p]) => {
    const row = document.createElement('div');
    row.className = 'prob-row';
    row.innerHTML = `<span class="name">${name}</span>
      <div class="bar-track"><div class="bar-fill"></div></div>
      <span class="pct">${(p * 100).toFixed(2)}%</span>`;
    bars.appendChild(row);
    requestAnimationFrame(() => row.querySelector('.bar-fill').style.width = (p * 100) + '%');
  });

  const info = DISEASE_INFO[data.prediction];
  if (info) {
    document.getElementById('diTitle').textContent = `About ${data.prediction}`;
    document.getElementById('diDesc').textContent = info.desc;
    document.getElementById('diSymptoms').innerHTML = info.symptoms.map(s => `<li>${s}</li>`).join('');
    document.getElementById('diSeek').textContent = info.seek;
  }
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth' });
}
