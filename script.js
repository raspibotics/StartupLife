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

const startup = new Startup(prompt("Enter your startup's name:") || "Tech Startup");
document.getElementById("stat-name").innerText = startup.name;

// Update stats on the page
function updateStats() {
  document.getElementById("stat-age").innerText = startup.months;
  document.getElementById("stat-funding").innerText = `$${startup.funding.toLocaleString()}`;
  document.getElementById("stat-reputation").innerText = startup.reputation;
  document.getElementById("stat-team").innerText = startup.teamSize;
  document.getElementById("stat-product").innerText = `${startup.productProgress}%`;
}

// Log events on the page
function logEvent(message) {
  const log = document.getElementById("event-log");
  const logEntry = document.createElement("p");
  logEntry.innerText = message;
  
    
    
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
    
    log.scrollTop = log.scrollHeight;
    
    log.scrollTop = log.scrollHeight;
    
}

// Random events logic
function randomEvent() {
  const events = [
    () => {
      logEvent("💸 A potential investor is interested!");
      if (showModal("Do you want to pitch your idea to the investor?")) {
        const fundingGain = Math.floor(Math.random() * 50000) + 10000;
        startup.funding += fundingGain;
        logEvent(`🎉 You secured $${fundingGain.toLocaleString()} in funding!`);
      } else {
        logEvent("🚶 You skipped the opportunity.");
      }
    },
    () => {
      logEvent("👨‍💻 A talented engineer wants to join your team!");
      if (showModal("Do you want to hire them? It costs $10,000.")) {
        if (startup.funding >= 10000) {
          startup.teamSize++;
          startup.funding -= 10000;
          logEvent("🎉 You hired a new team member! Team size increased.");
        } else {
          logEvent("💔 Not enough funding to hire them.");
        }
      }
    },
    () => {
      const productBoost = Math.floor(Math.random() * 20) + 5;
      startup.productProgress += productBoost;
      startup.productProgress = Math.min(startup.productProgress, 100); // Cap at 100%
      logEvent(`🚀 Your team made great progress! Product progress increased by ${productBoost}%.`);
    },
    () => {
      const randomExpense = Math.floor(Math.random() * 20000) + 5000;
      startup.funding -= randomExpense;
      logEvent(`💰 Unexpected expenses! You lost $${randomExpense.toLocaleString()}.`);
    },
    () => {
      const reputationChange = Math.floor(Math.random() * 20) - 10;
      startup.reputation += reputationChange;
      startup.reputation = Math.max(0, Math.min(100, startup.reputation)); // Clamp between 0 and 100
      logEvent(`📣 Public perception changed! Reputation changed by ${reputationChange}.`);
    },
  ];
  const randomIndex = Math.floor(Math.random() * events.length);
  events[randomIndex]();
}

// Handle "Next Month" button click
document.getElementById("next-month").addEventListener("click", () => {
  startup.months++;
  logEvent(`📅 Month ${startup.months}: Your startup is operating.`);
  randomEvent();
  updateStats();

  // Check for game end conditions
  if (startup.funding <= 0) {
    
    
function showDecision(message, callback) {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");

  popupMessage.innerText = message;
  popup.classList.remove("hidden");

  yesButton.onclick = () => {
    callback(true);
    popup.classList.add("hidden");
  };

  noButton.onclick = () => {
    callback(false);
    popup.classList.add("hidden");
  };
}


function showDecision(message, callback) {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");

  popupMessage.innerText = message;
  popup.classList.remove("hidden");

  yesButton.onclick = () => {
    callback(true);
    popup.classList.add("hidden");
  };

  noButton.onclick = () => {
    callback(false);
    popup.classList.add("hidden");
  };
}

function showModal(message, options = { showCancel: false, callback: null }) {
      const modal = document.getElementById("modal");
      const modalMessage = document.getElementById("modal-message");
      const modalOk = document.getElementById("modal-ok");
      const modalCancel = document.getElementById("modal-cancel");
      modalMessage.innerText = message;
      modal.classList.remove("hidden");
      
      modalOk.onclick = () => {
        if (options.callback) options.callback(true);
        modal.classList.add("hidden");
      };

      if (options.showCancel) {
        modalCancel.classList.remove("hidden");
        modalCancel.onclick = () => {
          if (options.callback) options.callback(false);
          modal.classList.add("hidden");
        };
      } else {
        modalCancel.classList.add("hidden");
      }
    }
    ("💀 Your startup ran out of funding. Game Over!");
    document.getElementById("next-month").disabled = true;
  } else if (startup.productProgress >= 100 && startup.months <= 24) {
    
    
function showDecision(message, callback) {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");

  popupMessage.innerText = message;
  popup.classList.remove("hidden");

  yesButton.onclick = () => {
    callback(true);
    popup.classList.add("hidden");
  };

  noButton.onclick = () => {
    callback(false);
    popup.classList.add("hidden");
  };
}


function showDecision(message, callback) {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");

  popupMessage.innerText = message;
  popup.classList.remove("hidden");

  yesButton.onclick = () => {
    callback(true);
    popup.classList.add("hidden");
  };

  noButton.onclick = () => {
    callback(false);
    popup.classList.add("hidden");
  };
}

function showModal(message, options = { showCancel: false, callback: null }) {
      const modal = document.getElementById("modal");
      const modalMessage = document.getElementById("modal-message");
      const modalOk = document.getElementById("modal-ok");
      const modalCancel = document.getElementById("modal-cancel");
      modalMessage.innerText = message;
      modal.classList.remove("hidden");
      
      modalOk.onclick = () => {
        if (options.callback) options.callback(true);
        modal.classList.add("hidden");
      };

      if (options.showCancel) {
        modalCancel.classList.remove("hidden");
        modalCancel.onclick = () => {
          if (options.callback) options.callback(false);
          modal.classList.add("hidden");
        };
      } else {
        modalCancel.classList.add("hidden");
      }
    }
    ("🎉 Your startup launched a successful product and survived! You win!");
    document.getElementById("next-month").disabled = true;
  } else if (startup.months >= 24) {
    
    
function showDecision(message, callback) {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");

  popupMessage.innerText = message;
  popup.classList.remove("hidden");

  yesButton.onclick = () => {
    callback(true);
    popup.classList.add("hidden");
  };

  noButton.onclick = () => {
    callback(false);
    popup.classList.add("hidden");
  };
}


function showDecision(message, callback) {
  const popup = document.getElementById("decision-popup");
  const popupMessage = document.getElementById("popup-message");
  const yesButton = document.getElementById("popup-yes");
  const noButton = document.getElementById("popup-no");

  popupMessage.innerText = message;
  popup.classList.remove("hidden");

  yesButton.onclick = () => {
    callback(true);
    popup.classList.add("hidden");
  };

  noButton.onclick = () => {
    callback(false);
    popup.classList.add("hidden");
  };
}

function showModal(message, options = { showCancel: false, callback: null }) {
      const modal = document.getElementById("modal");
      const modalMessage = document.getElementById("modal-message");
      const modalOk = document.getElementById("modal-ok");
      const modalCancel = document.getElementById("modal-cancel");
      modalMessage.innerText = message;
      modal.classList.remove("hidden");
      
      modalOk.onclick = () => {
        if (options.callback) options.callback(true);
        modal.classList.add("hidden");
      };

      if (options.showCancel) {
        modalCancel.classList.remove("hidden");
        modalCancel.onclick = () => {
          if (options.callback) options.callback(false);
          modal.classList.add("hidden");
        };
      } else {
        modalCancel.classList.add("hidden");
      }
    }
    ("⏳ Your startup survived 2 years! Reflect on your journey.");
    document.getElementById("next-month").disabled = true;
  }
});

// Initial Stats Update
updateStats();
