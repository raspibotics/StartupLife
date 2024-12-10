document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");
  const nextMonthButton = document.getElementById("next-month");
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalOk = document.getElementById("modal-ok");
  const modalCancel = document.getElementById("modal-cancel");

  // Sound elements
  const buttonClickSound = document.getElementById("button-click-sound");
  const decisionConfirmSound = document.getElementById("decision-confirm-sound");
  const decisionCancelSound = document.getElementById("decision-cancel-sound");
  const eventPositiveSound = document.getElementById("event-positive-sound");
  const eventNegativeSound = document.getElementById("event-negative-sound");

  // Ensure critical elements are available
  if (!popup || !popupMessage || !yesButton || !noButton || !nextMonthButton || !modal || !modalMessage || !modalOk) {
    console.error("One or more critical elements are missing from the DOM.");
    return;
  }

  // Decision Popup Handlers
  function showDecision(message, callback) {
    popupMessage.innerText = message;
    popup.classList.remove("hidden");

    yesButton.onclick = () => {
      callback(true);
      popup.classList.add("hidden");
      decisionConfirmSound.play(); // Play confirm sound
    };

    noButton.onclick = () => {
      callback(false);
      popup.classList.add("hidden");
      decisionCancelSound.play(); // Play cancel sound
    };
  }

  // Modal Handlers
  function showModal(message, options = { showCancel: false, callback: null }) {
    modalMessage.innerText = message;
    modal.classList.remove("hidden");

    modalOk.onclick = () => {
      if (options.callback) options.callback(true);
      modal.classList.add("hidden");
      buttonClickSound.play(); // Play button click sound
    };

    if (options.showCancel) {
      modalCancel.classList.remove("hidden");
      modalCancel.onclick = () => {
        if (options.callback) options.callback(false);
        modal.classList.add("hidden");
        buttonClickSound.play(); // Play button click sound
      };
    } else {
      modalCancel.classList.add("hidden");
    }
  }

  // Startup class
  class Startup {
    constructor(name) {
      this.name = name;
      this.months = 0;
      this.funding = 100000; // Initial funding in USD
      this.reputation = 50; // Reputation (0-100 scale)
      this.teamSize = 2; // Starting with founders
      this.productProgress = 0; // Product completion percentage
    }
  }

  // Initialize Startup
  const startupName = prompt("Enter your startup's name:") || "Tech Startup";
  const startup = new Startup(startupName);
  document.getElementById("stat-name").innerText = startup.name;

  // Update stats on the page
  function updateStats() {
    // Update progress bars based on 0-100 scale
    document.getElementById("stat-age-bar").style.width = `${(startup.months / 24) * 100}%`;
    document.getElementById("stat-funding-bar").style.width = `${(startup.funding / 100000) * 100}%`;
    document.getElementById("stat-reputation-bar").style.width = `${startup.reputation}%`;
    document.getElementById("stat-team-bar").style.width = `${(startup.teamSize / 10) * 100}%`;  // Assume max team size is 10
    document.getElementById("stat-product-bar").style.width = `${startup.productProgress}%`;

    // Color coding for progress bars
    document.getElementById("stat-age-bar").style.backgroundColor = "#4CAF50"; // Green
    document.getElementById("stat-funding-bar").style.backgroundColor = "#2D70F4"; // Blue
    document.getElementById("stat-reputation-bar").style.backgroundColor = "#FFEB3B"; // Yellow
    document.getElementById("stat-team-bar").style.backgroundColor = "#FFC107"; // Amber
    document.getElementById("stat-product-bar").style.backgroundColor = "#FF5722"; // Red
  }

  // Log events on the page
  function logEvent(message) {
    const log = document.getElementById("event-log");
    const logEntry = document.createElement("p");
    logEntry.innerText = message;
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight; // Auto-scroll to the latest event
  }

  // Random events logic
  function randomEvent() {
    const events = [
      () => {
        logEvent("💸 A potential investor is interested!");
        showDecision("Do you want to pitch your idea to the investor?", (yes) => {
          if (yes) {
            const fundingGain = Math.floor(Math.random() * 50000) + 10000;
            startup.funding += fundingGain;
            logEvent(`🎉 You secured $${fundingGain.toLocaleString()} in funding!`);
            eventPositiveSound.play(); // Play positive event sound
          } else {
            logEvent("🚶 You skipped the opportunity.");
            eventNegativeSound.play(); // Play negative event sound
          }
          updateStats();
        });
      },
      () => {
        logEvent("👨‍💻 A talented engineer wants to join your team!");
        showDecision("Do you want to hire them? It costs $10,000.", (yes) => {
          if (yes) {
            if (startup.funding >= 10000) {
              startup.teamSize++;
              startup.funding -= 10000;
              logEvent("🎉 You hired a new team member! Team size increased.");
              eventPositiveSound.play(); // Play positive event sound
            } else {
              logEvent("💔 Not enough funding to hire them.");
              eventNegativeSound.play(); // Play negative event sound
            }
          }
          updateStats();
        });
      },
      () => {
        const productBoost = Math.floor(Math.random() * 20) + 5;
        startup.productProgress += productBoost;
        startup.productProgress = Math.min(startup.productProgress, 100); // Cap at 100%
        logEvent(`🚀 Your team made great progress! Product progress increased by ${productBoost}%.`);
        eventPositiveSound.play(); // Play positive event sound
      },
      () => {
        const randomExpense = Math.floor(Math.random() * 20000) + 5000;
        startup.funding -= randomExpense;
        logEvent(`💰 Unexpected expenses! You lost $${randomExpense.toLocaleString()}.`);
        eventNegativeSound.play(); // Play negative event sound
      },
      () => {
        const reputationChange = Math.floor(Math.random() * 20) - 10;
        startup.reputation += reputationChange;
        startup.reputation = Math.max(0, Math.min(100, startup.reputation)); // Clamp between 0 and 100
        logEvent(`📣 Public perception changed! Reputation changed by ${reputationChange}.`);
        eventPositiveSound.play(); // Play positive event sound
      },
    ];
    const randomIndex = Math.floor(Math.random() * events.length);
    events[randomIndex]();
  }

  // Next Month Button Handler
  nextMonthButton.addEventListener("click", () => {
    startup.months++;
    logEvent(`📅 Month ${startup.months}: Your startup is operating.`);
    randomEvent();
    updateStats();

    // Check for game end conditions
    if (startup.funding <= 0) {
      showModal("💀 Your startup ran out of funding. Game Over!");
      nextMonthButton.disabled = true;
      decisionCancelSound.play(); // Play cancel sound
    } else if (startup.productProgress >= 100 && startup.months <= 24) {
      showModal("🎉 Your startup launched a successful product and survived! You win!");
      nextMonthButton.disabled = true;
      decisionConfirmSound.play(); // Play confirm sound
    } else if (startup.months >= 24) {
      showModal("⏳ Your startup survived 2 years! Reflect on your journey.");
      nextMonthButton.disabled = true;
      decisionConfirmSound.play(); // Play confirm sound
    }
  });

  // Initial Stats Update
  updateStats();
});
