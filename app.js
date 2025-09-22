// Config: default to Yahtzee-style 5d6
const DICE = 5;
const SIDES = 6;

// Elements
let diceBody, totalField, rollBtn;

// avoid double init
let __inited = false;
document.addEventListener('DOMContentLoaded', init);

function init(){
  if (__inited) return; __inited = true;

  diceBody = document.getElementById('diceBody');
  totalField = document.getElementById('total');
  rollBtn = document.getElementById('rollBtn');

  if (!diceBody || !totalField || !rollBtn) {
    console.error('Missing required elements. Check IDs and file paths.');
    const msg = document.createElement('p');
    msg.style.color = '#ffb3b3';
    msg.textContent = 'Error: Required elements not found. Make sure index.html, style.css, and app.js are in the SAME folder and the names/paths match exactly.';
    document.body.prepend(msg);
    return;
  }

  const dc = document.getElementById('diceCount');
  const sc = document.getElementById('sidesCount');
  if (dc) dc.textContent = DICE;
  if (sc) sc.textContent = SIDES;

  buildRows();
  rollBtn.addEventListener('click', rollDice);
  rollDice(); // auto-roll on load
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
    input.readOnly = true;        // random fields are read-only
    input.inputMode = 'numeric';
    input.className = 'num';      // right-justified via CSS
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

function randInt(sides){
  if (crypto && crypto.getRandomValues) {
    const x = new Uint32Array(1);
    crypto.getRandomValues(x);
    return (x[0] % sides) + 1;
  }
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(){
  let sum = 0;
  for (let i = 1; i <= DICE; i++){
    const val = randInt(SIDES);
    sum += val;
    const input = document.getElementById(`die-${i}`);
    if (input) input.value = String(val);
  }
  if (totalField) totalField.value = String(sum);
  if (rollBtn) rollBtn.focus();   // let Enter roll again
}
