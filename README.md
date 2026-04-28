# Scoundrel: Solo Card Dungeon

A web-based implementation of the tactical solo card game **Scoundrel**. Navigate through a 52-card dungeon deck, manage your health and equipment, and survive until the deck is empty.

## 🎮 Live Demo

https://d-weimer.github.io/scoundrel-solo-card-game/

## ✨ Features

- **Dynamic Combat:** Fight monsters using a shield-management system where the order of encounters matters.
- **Animated UI:** Real-time HP counter that shifts color (Green for healing, Red for damage) with a rolling count effect.
- **Sleek Layout:** Centered dashboard for tracking HP, Shield, and the last monster fought.
- **Strict Ruleset:** Includes a custom deck filter (no red face cards) and room-based constraints (1 potion/shield per room).
- **Responsive Design:** Fully playable on desktop and mobile browsers.

## 🛠️ How to Play

1.  **Deal a Room:** Each room consists of 4 cards. You must play exactly 3 cards before you can move to the next room. The 4th card moves to the bottom of the deck.
2.  **Combat (Clubs & Spades):** Monsters deal damage equal to their value (J=11, Q=12, K=13, A=14). If you have a **Shield**, it absorbs damage.
    - _Note:_ A shield only stays intact if the current monster is weaker than the last monster fought with that shield. If you fight a stronger monster, your shield breaks immediately.
3.  **Healing (Hearts):** Gain HP up to a maximum of 20. Limit of one potion per room.
4.  **Equipment (Diamonds):** Equip a shield with a value equal to the card. Limit of one shield per room.
5.  **Fleeing:** If a room looks too dangerous, you can flee—but only if you haven't played any cards in the current room yet. You cannot flee twice in a row.

## 🚀 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/d-weimer/scoundrel-solo-card-game.git
    ```
2.  **Open the project:**
    Simply open `index.html` in any modern web browser.

## 📁 Project Structure

- `index.html` - The game structure, stats container, and instructions modal.
- `style.css` - Custom dark-theme styling, flexbox centering, and HP animation states.
- `script.js` - Game logic, deck shuffling, combat math, and UI animation controllers.

## 🛠️ Built With

- HTML5
- CSS3 (Flexbox & Transitions)
- Vanilla JavaScript (ES6+)

---

_Created by Daniel Weimer — 2026_
