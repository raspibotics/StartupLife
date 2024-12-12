document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("decision-popup");
  const popupTitle = document.getElementById("popup-title");
  const popupDescription = document.getElementById("popup-description");
  const popupChoices = document.getElementById("popup-choices");

  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalOk = document.getElementById("modal-ok");
  const modalCancel = document.getElementById("modal-cancel");

  const nextMonthButton = document.getElementById("next-month");

  // Start screen elements
  const startScreen = document.getElementById("start-screen");
  const startButton = document.getElementById("start-button");
  const carNameInput = document.getElementById("car-name-input");

  // Minigame 1 elements
  const minigamePopup = document.getElementById("minigame-popup");
  const minigameGrid = document.getElementById("minigame-grid");

  // Minigame 2 elements (Investment round)
  const investmentPopup = document.getElementById("investment-popup");
  const investmentGrid = document.getElementById("investment-grid");

  // Sounds
  const buttonClickSound = document.getElementById("button-click-sound");
  const decisionConfirmSound = document.getElementById("decision-confirm-sound");
  const decisionCancelSound = document.getElementById("decision-cancel-sound");
  const eventPositiveSound = document.getElementById("event-positive-sound");
  const eventNegativeSound = document.getElementById("event-negative-sound");

  function showModal(message, options = { showCancel: false, callback: null }) {
    modalMessage.innerText = message;
    modal.classList.remove("hidden");

    modalOk.onclick = () => {
      if (options.callback) options.callback(true);
      modal.classList.add("hidden");
      buttonClickSound.play();
    };

    if (options.showCancel) {
      modalCancel.classList.remove("hidden");
      modalCancel.onclick = () => {
        if (options.callback) options.callback(false);
        modal.classList.add("hidden");
        buttonClickSound.play();
      };
    } else {
      modalCancel.classList.add("hidden");
    }
  }

  function showChoices(title, description, choices) {
    popupTitle.innerText = title;
    popupDescription.innerText = description;
    popupChoices.innerHTML = "";
    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.innerText = choice.text;
      btn.onclick = () => {
        popup.classList.add("hidden");
        decisionConfirmSound.play();
        choice.onSelect();
      };
      popupChoices.appendChild(btn);
    });
    popup.classList.remove("hidden");
  }

  class Startup {
    constructor(name) {
      this.name = name;
      this.months = 0;
      this.funding = 100000;
      this.reputation = 50;
      this.teamSize = 2;
      this.productProgress = 0;

      this.teamMorale = 100;
      this.inventoryLevel = 50;
      this.supplyReliability = 70;
      this.ipProtection = 50;
      this.sustainability = 50;
    }
  }

  let startup;

  function adjustStat(statName, amount, min = 0, max = 100000) {
    startup[statName] = Math.max(min, Math.min(max, startup[statName] + amount));
  }

  function updateStats() {
    document.getElementById("stat-age-bar").style.width = `${(startup.months / 24) * 100}%`;
    document.getElementById("stat-funding-bar").style.width = `${(startup.funding / 100000) * 100}%`;
    document.getElementById("stat-reputation-bar").style.width = `${startup.reputation}%`;
    document.getElementById("stat-team-bar").style.width = `${(startup.teamSize / 10) * 100}%`;
    document.getElementById("stat-product-bar").style.width = `${startup.productProgress}%`;
    document.getElementById("stat-sustainability-bar").style.width = `${startup.sustainability}%`;

    // Restore the original color coding for each progress bar
    document.getElementById("stat-age-bar").style.backgroundColor = "#4CAF50";        // Green
    document.getElementById("stat-funding-bar").style.backgroundColor = "#2D70F4";   // Blue
    document.getElementById("stat-reputation-bar").style.backgroundColor = "#FFEB3B";// Yellow
    document.getElementById("stat-team-bar").style.backgroundColor = "#FFC107";      // Amber
    document.getElementById("stat-product-bar").style.backgroundColor = "#FF5722";   // Red
    document.getElementById("stat-sustainability-bar").style.backgroundColor = "#66BB6A"; // Greenish

    console.log(`Morale: ${startup.teamMorale}% | Inventory: ${startup.inventoryLevel}% | Supply Reliability: ${startup.supplyReliability}% | IP Protection: ${startup.ipProtection}% | Sustainability: ${startup.sustainability}%`);
  }

  function logEvent(message) {
    const log = document.getElementById("event-log");
    const logEntry = document.createElement("p");
    logEntry.innerText = message;
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
  }

  const scenarios = [
    {
      title: "Investor Pitch for Modular Battery Packs",
      description: "An investor is interested in your innovative modular battery pack approach...",
      choices: [
        { 
          text: "Show prototype", 
          onSelect: () => {
            const successChance = (startup.teamMorale > 60 && startup.productProgress > 30) ? 0.8 : 0.4;
            if (Math.random() < successChance) {
              adjustStat('funding', 30000);
              adjustStat('reputation', 5);
              logEvent("Dazzled investor with prototype! +$30,000, Reputation +5");
              eventPositiveSound.play();
            } else {
              adjustStat('reputation', -5);
              logEvent("Prototype unimpressive. No funding, -5 Reputation");
              eventNegativeSound.play();
            }
            updateStats();
          }
        },
        {
          text: "Emphasize sustainability",
          onSelect: () => {
            const successChance = startup.sustainability > 60 ? 0.7 : 0.3;
            if (Math.random() < successChance) {
              adjustStat('funding', 20000);
              adjustStat('reputation', 5);
              logEvent("Investor loved green angle! +$20,000, Reputation +5");
              eventPositiveSound.play();
            } else {
              logEvent("Sustainability pitch not convincing. No deal.");
              eventNegativeSound.play();
            }
            updateStats();
          }
        }
      ]
    }
  ];

  // Mini-Game 1: Quality Control
  let miniGameCount1 = 0;
  const maxMiniGames1 = 2;
  let miniGameTimeout;

  function triggerMinigame1() {
    if (miniGameCount1 >= maxMiniGames1) return;
    miniGameCount1++;
    showMinigame1();
  }

  function showMinigame1() {
    minigameGrid.innerHTML = "";
    const emojis = ["🔋", "🚗", "🔌", "⚡"];
    const mainEmoji = emojis[Math.floor(Math.random()*emojis.length)];
    let oddEmoji = mainEmoji;
    while (oddEmoji === mainEmoji) {
      oddEmoji = emojis[Math.floor(Math.random()*emojis.length)];
    }

    const totalItems = 16;
    const oddIndex = Math.floor(Math.random()*totalItems);

    for (let i=0; i<totalItems; i++) {
      const span = document.createElement("span");
      span.innerText = (i === oddIndex) ? oddEmoji : mainEmoji;
      span.onclick = () => handleMinigame1Click(i === oddIndex);
      minigameGrid.appendChild(span);
    }

    minigamePopup.classList.remove("hidden");
    miniGameTimeout = setTimeout(() => {
      handleMinigame1Timeout();
    }, 5000);
  }

  function handleMinigame1Click(isOdd) {
    clearTimeout(miniGameTimeout);
    minigamePopup.classList.add("hidden");
    if (isOdd) {
      logEvent("You found the faulty component! Quality improves.");
      adjustStat('reputation', 5);
      adjustStat('funding', 5000);
      eventPositiveSound.play();
    } else {
      logEvent("That wasn't the faulty part!");
      eventNegativeSound.play();
    }
    updateStats();
  }

  function handleMinigame1Timeout() {
    minigamePopup.classList.add("hidden");
    logEvent("Time’s up! Failed to identify the issue.");
    adjustStat('reputation', -5);
    adjustStat('funding', -5000);
    eventNegativeSound.play();
    updateStats();
  }

  // Mini-Game 2: Investment Round
  let miniGameCount2 = 0;
  const maxMiniGames2 = 2;
  let investmentTimeout;
  let clickedBags = 0;

  function triggerMinigame2() {
    if (miniGameCount2 >= maxMiniGames2) return;
    miniGameCount2++;
    showMinigame2();
  }

  function showMinigame2() {
    investmentGrid.innerHTML = "";
    clickedBags = 0;

    const totalItems = 20; 
    for (let i=0; i<totalItems; i++) {
      const span = document.createElement("span");
      span.innerText = "💰";
      span.onclick = () => {
        clickedBags++;
        // Remove or hide the bag after click
        span.style.visibility = "hidden";
      };
      investmentGrid.appendChild(span);
    }

    investmentPopup.classList.remove("hidden");
    investmentTimeout = setTimeout(() => {
      handleMinigame2Timeout();
    }, 3000); // 3 seconds
  }

  function handleMinigame2Timeout() {
    investmentPopup.classList.add("hidden");
    let fundingGain = clickedBags * 2000;
    if (fundingGain > 0) {
      logEvent(`You collected ${clickedBags} money bags! Gained $${fundingGain.toLocaleString()}.`);
      adjustStat('funding', fundingGain);
      eventPositiveSound.play();
    } else {
      logEvent("No bags collected in time, no extra funding gained.");
      eventNegativeSound.play();
    }
    updateStats();
  }

  startButton.addEventListener("click", () => {
    const chosenName = carNameInput.value.trim() || "Tech Startup";
    startup = new Startup(chosenName);
    document.getElementById("stat-name").innerText = startup.name;
    startScreen.style.display = "none";
    updateStats();
  });

  nextMonthButton.addEventListener("click", () => {
    startup.months++;
    logEvent(`📅 Month ${startup.months}: Another month passes...`);

    // Mini-game triggers
    // Mini-game 1 at month 6, 12
    // Mini-game 2 at month 9, 18
    if ((startup.months === 6 || startup.months === 12) && miniGameCount1 < maxMiniGames1) {
      triggerMinigame1();
    } else if ((startup.months === 9 || startup.months === 18) && miniGameCount2 < maxMiniGames2) {
      triggerMinigame2();
    } else {
      // Normal scenario
      randomEvent();
    }

    updateStats();

    // End conditions
    if (startup.funding <= 0) {
      showModal("💀 Your startup ran out of funding. Game Over!");
      nextMonthButton.disabled = true;
      decisionCancelSound.play();
    } else if (startup.productProgress >= 100 && startup.months <= 24) {
      showModal("🎉 You launched a successful product and survived! You win!");
      nextMonthButton.disabled = true;
      decisionConfirmSound.play();
    } else if (startup.months >= 24) {
      showModal("⏳ Your startup survived 2 years! Reflect on your journey.");
      nextMonthButton.disabled = true;
      decisionConfirmSound.play();
    }
  });

  function randomEvent() {
    if (scenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      const scenario = scenarios[randomIndex];
      showChoices(scenario.title, scenario.description, scenario.choices);
    } else {
      logEvent("No scenario available this month.");
    }
  }
});
