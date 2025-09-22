// Config: default to Yahtzee-style 5d6
// Auto-roll on load (Requirement 2: onload)
rollDice();
}


function buildRows(){
const frag = document.createDocumentFragment();
for(let i=1;i<=DICE;i++){
const tr = document.createElement('tr');
const th = document.createElement('th');
th.scope = 'row';
th.textContent = `Die ${i}`;


const td = document.createElement('td');
const input = document.createElement('input');
input.type = 'text';
input.readOnly = true; // random fields are read-only
input.inputMode = 'numeric';
input.className = 'num';
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


// Secure-ish random int 1..SIDES
function randInt(sides){
if (window.crypto && window.crypto.getRandomValues) {
const array = new Uint32Array(1);
window.crypto.getRandomValues(array);
return (array[0] % sides) + 1;
}
return Math.floor(Math.random()*sides) + 1; // fallback
}


function rollDice(){
let sum = 0;
for(let i=1;i<=DICE;i++){
const val = randInt(SIDES);
sum += val;
const input = document.getElementById(`die-${i}`);
input.value = String(val);
}
totalField.value = String(sum);


// Keep keyboard flow: focus the roll button so Enter triggers again
if (rollBtn) rollBtn.focus();
}