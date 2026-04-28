let hp = 20;
let shield = 0;
let lastMonsterHit = 0;
let deck = [];
let currentRoomCards = [];
let cardsPlayedThisRoom = 0;
let canFlee = true;
let shieldEquippedThisRoom = false;
let potionConsumedThisRoom = false;

const suitIcons = { Hearts: "♥", Diamonds: "♦", Clubs: "♣", Spades: "♠" };

// --- Info Modal Logic ---
const modal = document.getElementById("info-modal");
const infoBtn = document.getElementById("info-btn");
const closeBtn = document.querySelector(".close-modal");

infoBtn.onclick = () => {
  modal.style.display = "block";
};
closeBtn.onclick = () => {
  modal.style.display = "none";
};
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// --- Animation Logic ---

function animateHP(targetHP) {
  const hpElement = document.getElementById("hp");
  let currentDisplayHP = parseInt(hpElement.innerText);

  if (currentDisplayHP === targetHP) return;

  const isHealing = targetHP > currentDisplayHP;

  // Apply temporary animation colors
  hpElement.classList.remove("hp-healing", "hp-taking-damage");
  hpElement.classList.add(isHealing ? "hp-healing" : "hp-taking-damage");

  const interval = setInterval(() => {
    if (isHealing) {
      currentDisplayHP++;
    } else {
      currentDisplayHP--;
    }

    hpElement.innerText = currentDisplayHP;

    if (currentDisplayHP === targetHP) {
      clearInterval(interval);
      hpElement.classList.remove("hp-healing", "hp-taking-damage");

      // Set permanent red if dead
      if (targetHP <= 0) {
        hpElement.classList.add("hp-dead");
      } else {
        hpElement.classList.remove("hp-dead");
      }
    }
  }, 90); // Animation speed
}

// --- Game Logic ---

function createDeck() {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  deck = [];
  for (let s of suits) {
    for (let v = 2; v <= 14; v++) {
      // Remove red face cards
      if ((s === "Hearts" || s === "Diamonds") && v > 10) continue;
      deck.push({ suit: s, val: v, label: getLabel(v) });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function getLabel(v) {
  if (v <= 10) return v;
  return { 11: "J", 12: "Q", 13: "K", 14: "A" }[v];
}

function updateUI() {
  // Prevent HP from showing negative numbers
  if (hp < 0) hp = 0;

  // Trigger counter animation
  animateHP(hp);

  document.getElementById("shield").innerText = shield;
  document.getElementById("deck-count").innerText = deck.length;

  // Monster label formatting (J, Q, K, A)
  let monsterLabel = lastMonsterHit;
  if (lastMonsterHit > 10) {
    monsterLabel = { 11: "J", 12: "Q", 13: "K", 14: "A" }[lastMonsterHit];
  }
  document.getElementById("last-monster").innerText = monsterLabel;

  const fleeBtn = document.getElementById("flee-btn");
  const dealBtn = document.getElementById("deal-btn");
  const restartBtn = document.getElementById("restart-btn");

  fleeBtn.disabled =
    cardsPlayedThisRoom > 0 || !canFlee || currentRoomCards.length === 0;
  dealBtn.disabled =
    cardsPlayedThisRoom < 3 && currentRoomCards.some((c) => c !== null);

  if (hp <= 0) {
    document.getElementById("log").innerText =
      "GAME OVER. You fell in the dungeon.";
    dealBtn.disabled = fleeBtn.disabled = true;
    restartBtn.style.display = "block"; // Centered via CSS flexbox
    document.getElementById("room").style.opacity = "0.5";
  } else if (deck.length === 0 && currentRoomCards.every((c) => c === null)) {
    document.getElementById("log").innerText =
      "VICTORY! You conquered the dungeon!";
    restartBtn.style.display = "block";
  } else {
    restartBtn.style.display = "none";
  }
}

function restartGame() {
  hp = 20;
  shield = 0;
  lastMonsterHit = 0;
  currentRoomCards = [];
  cardsPlayedThisRoom = 0;
  canFlee = true;
  shieldEquippedThisRoom = false;
  potionConsumedThisRoom = false;

  // Reset HP color and text
  const hpElement = document.getElementById("hp");
  hpElement.classList.remove("hp-dead", "hp-healing", "hp-taking-damage");
  hpElement.innerText = hp;

  document.getElementById("room").style.opacity = "1";
  document.getElementById("room").innerHTML = "";
  document.getElementById("log").innerText = "A new journey begins.";
  document.getElementById("restart-btn").style.display = "none";

  createDeck();
  updateUI();
}

function dealRoom() {
  const remaining = currentRoomCards.filter((c) => c !== null);
  if (remaining.length > 0) {
    deck.push(...remaining); // Move 4th card to bottom
  }

  if (deck.length === 0) return;

  document.getElementById("log").innerText = "Entering a new room...";

  currentRoomCards = deck.splice(0, 4);
  cardsPlayedThisRoom = 0;
  shieldEquippedThisRoom = false;
  potionConsumedThisRoom = false;

  renderRoom();
  updateUI();
}

function renderRoom() {
  const roomEl = document.getElementById("room");
  roomEl.innerHTML = "";
  currentRoomCards.forEach((card, index) => {
    if (!card) return;
    const div = document.createElement("div");
    div.className = `card ${card.suit}`;
    div.innerHTML = `<span>${card.label}</span><span class="suit-icon">${suitIcons[card.suit]}</span><span style="align-self:flex-end">${card.label}</span>`;
    div.onclick = () => playCard(index, div);
    roomEl.appendChild(div);
  });
}

function fleeRoom() {
  deck.push(...currentRoomCards.filter((c) => c !== null));
  currentRoomCards = [];
  canFlee = false;
  document.getElementById("log").innerText =
    "You fled! The cards return to the bottom of the deck.";
  dealRoom();
}

function playCard(index, element) {
  if (cardsPlayedThisRoom >= 3 || element.classList.contains("disabled"))
    return;

  const card = currentRoomCards[index];
  let message = "";

  if (
    (card.suit === "Diamonds" && shieldEquippedThisRoom) ||
    (card.suit === "Hearts" && potionConsumedThisRoom)
  ) {
    message = `${card.suit} discarded (limit 1 per room).`;
  } else {
    if (card.suit === "Hearts") {
      hp = Math.min(20, hp + card.val);
      potionConsumedThisRoom = true;
      message = `Healed for ${card.val}.`;
    } else if (card.suit === "Diamonds") {
      shield = card.val;
      lastMonsterHit = 0;
      shieldEquippedThisRoom = true;
      message = `New Shield: ${card.val}.`;
    } else {
      let damage = card.val;
      if (shield > 0) {
        if (card.val < lastMonsterHit || lastMonsterHit === 0) {
          damage = Math.max(0, card.val - shield);
          lastMonsterHit = card.val;
        } else {
          shield = 0;
          lastMonsterHit = 0;
          message = "Shield broke! ";
        }
      }
      hp -= damage;
      message += `Monster hit for ${damage}.`;
    }
  }

  currentRoomCards[index] = null;
  element.style.visibility = "hidden";
  cardsPlayedThisRoom++;
  canFlee = true;

  if (cardsPlayedThisRoom === 3) {
    message += " [Room finished.]";
    const remainingCards = document.querySelectorAll(".card");
    remainingCards.forEach((c) => c.classList.add("disabled"));
  }

  document.getElementById("log").innerText = message;
  updateUI();
}

document.getElementById("deal-btn").onclick = dealRoom;
document.getElementById("flee-btn").onclick = fleeRoom;
document.getElementById("restart-btn").onclick = restartGame;

createDeck();
updateUI();
