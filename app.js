// ===== Config: default to 5 dice, 6 sides (5d6) =====
const DICE = 5;
const SIDES = 6;

/**
 * IMPORTANT — point this at your deployed API base URL
 * Example: "https://your-api-app.azurewebsites.net"
 */
const API_BASE = "https://YOUR-API-NAME.azurewebsites.net";

// Elements
let diceBody, totalField, rollBtn, statusEl, corsBtn;

// Initialize when DOM is ready (auto-roll on first load)
document.addEventListener('DOMContentLoaded', init);

function init(){
  diceBody   = document.getElementById('diceBody');
  totalField = document.getElementById('total');
  rollBtn    = document.getElementById('rollBtn');
  statusEl   = document.getElementById('status');
  corsBtn    = document.getElementById('corsBtn');

  // Show config text
  document.getElementById('diceCount').textContent = DICE;
  document.getElementById('sidesCount').textContent = SIDES;

  // Build rows once
  buildRows();

  // Bind events
  rollBtn.addEventListener('click', rollDice);
  if (corsBtn) corsBtn.addEventListener('click', demoCorsFailure);

  // Wake server asynchronously, then auto-roll
  wakeServer().finally(() => {
    rollDice();
  });
}

function setStatus(msg){
  if (statusEl) statusEl.textContent = msg || "";
}

async function wakeServer(){
  try{
    setStatus("Waking server…");
    const r = await fetch(`${API_BASE}/api/wakeup`, { mode: "cors" });
    if (!r.ok) throw new Error(`Wakeup HTTP ${r.status}`);
    const data = await r.json();
    setStatus(`Server awake @ ${new Date(data.time).toLocaleString()}`);
  }catch(err){
    setStatus(`Wakeup failed (you can still try rolling): ${String(err).slice(0,160)}`);
  }
}

function buildRows(){
  const frag = document.createDocumentFragment();
  for (let i = 1; i <= DICE; i++){
    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = `Die ${i}`;

    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;       // random fields are read-only
    input.inputMode = 'numeric';
    input.className = 'num';     // right-justified via CSS
    input.id = `die-${i}`;
    input.setAttribute('aria-label', `Value of die ${i}`);

    td.appendChild(input);
    tr.appendChild(th);
    tr.appendChild(td);
    frag.appendChild(tr);
  }
  diceBody.innerHTML = '';
  diceBody.appendChild(frag);
}

// SERVER randoms — roll all dice at once via /api/rolls
async function rollDice(){
  try{
    setStatus("Rolling on server…");
    const r = await fetch(`${API_BASE}/api/rolls?dice=${DICE}&sides=${SIDES}`, { mode: "cors" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const { values, sum } = await r.json();

    values.forEach((val, idx) => {
      const input = document.getElementById(`die-${idx + 1}`);
      if (input) input.value = String(val);
    });
    totalField.value = String(sum);
    setStatus("Done.");
  }catch(err){
    setStatus(`Roll failed: ${String(err).slice(0,160)}`);
  }

  // Keep keyboard flow: focus the roll button so Enter triggers again
  if (rollBtn) rollBtn.focus();
}

/**
 * Demonstrate an intentional CORS failure by calling an endpoint that
 * does NOT send CORS headers from the server. The browser should block it.
 */
async function demoCorsFailure(){
  setStatus("Calling /api/blocked to demonstrate CORS failure…");
  try{
    await fetch(`${API_BASE}/api/blocked`, { mode: "cors" });
    setStatus("Unexpected: /api/blocked succeeded (server must NOT send CORS here).");
  }catch(err){
    setStatus(`Expected CORS failure observed: ${String(err).slice(0,160)}`);
  }
}
