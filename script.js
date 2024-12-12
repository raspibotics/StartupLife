document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("decision-popup");
  const popupTitle = document.getElementById("popup-title");
  const popupDescription = document.getElementById("popup-description");
  const popupChoices = document.getElementById("popup-choices");

  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalOk = document.getElementById("modal-ok");
  const modalCancel = document.getElementById("modal-cancel");

  const nextWeekButton = document.getElementById("next-week");

  // Start screen elements
  const startScreen = document.getElementById("start-screen");
  const startButton = document.getElementById("start-button");
  const carNameInput = document.getElementById("car-name-input");

  // Minigames elements
  const minigamePopup = document.getElementById("minigame-popup");
  const minigameGrid = document.getElementById("minigame-grid");
  const investmentPopup = document.getElementById("investment-popup");
  const investmentGrid = document.getElementById("investment-grid");
  const envMinigamePopup = document.getElementById("envminigame-popup");
  const envMinigameGrid = document.getElementById("envminigame-grid");

  // Sounds
  const buttonClickSound = document.getElementById("button-click-sound");
  const decisionConfirmSound = document.getElementById("decision-confirm-sound");
  const decisionCancelSound = document.getElementById("decision-cancel-sound");
  const eventPositiveSound = document.getElementById("event-positive-sound");
  const eventNegativeSound = document.getElementById("event-negative-sound");
  const backgroundMusic = document.getElementById("background-music");

  // Constants for max values
  const MAX_WEEK = 104;
  const MAX_CASH = 100000;
  const MAX_REP = 100;
  const MAX_ENV = 100;
  const MAX_WORKERS = 10;

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
      this.week = 0;            
      this.cash = 100000;       
      this.reputation = 50;
      this.workers = 2;         
      this.environmental = 50;  
    }
  }

  let startup;

  function adjustStat(statName, amount) {
    // Clamp values based on stat
    let minVal = 0;
    let maxVal;
    switch (statName) {
      case 'week': maxVal = MAX_WEEK; break;
      case 'cash': maxVal = MAX_CASH; break;
      case 'reputation': maxVal = MAX_REP; break;
      case 'environmental': maxVal = MAX_ENV; break;
      case 'workers': maxVal = MAX_WORKERS; break;
      default: maxVal = 100000; // fallback if needed
    }

    startup[statName] = Math.max(minVal, Math.min(maxVal, startup[statName] + amount));
  }

  function updateStats() {
    // Update bars with clamped values
    document.getElementById("stat-week-bar").style.width = `${(startup.week / MAX_WEEK) * 100}%`;
    document.getElementById("stat-cash-bar").style.width = `${(startup.cash / MAX_CASH) * 100}%`;
    document.getElementById("stat-reputation-bar").style.width = `${(startup.reputation)}%`;
    document.getElementById("stat-workers-bar").style.width = `${(startup.workers / MAX_WORKERS) * 100}%`;
    document.getElementById("stat-environmental-bar").style.width = `${(startup.environmental)}%`;

    document.getElementById("stat-week-bar").style.backgroundColor = "#4CAF50";       
    document.getElementById("stat-cash-bar").style.backgroundColor = "#2D70F4"; 
    document.getElementById("stat-reputation-bar").style.backgroundColor = "#FFEB3B";
    document.getElementById("stat-workers-bar").style.backgroundColor = "#FFC107";
    document.getElementById("stat-environmental-bar").style.backgroundColor = "#66BB6A";

    console.log(`Week: ${startup.week}, Rep: ${startup.reputation}, Env: ${startup.environmental}, Cash: ${startup.cash}, Workers: ${startup.workers}`);
  }

  function logEvent(message) {
    const log = document.getElementById("event-log");
    const logEntry = document.createElement("p");
    logEntry.innerText = message;
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
  }

  // Check end conditions
  function checkEndConditions() {
    if (startup.cash <= 0) {
      endGame("Your startup ran out of cash.");
      return true;
    }
    if (startup.reputation <= 0) {
      endGame("Your startup lost all public trust.");
      return true;
    }
    if (startup.environmental <= 0) {
      endGame("Your startup's environmental record collapsed.");
      return true;
    }
    if (startup.workers <= 0) {
      endGame("You have no workers left to continue operations.");
      return true;
    }
    return false;
  }

  function endGame(reason) {
    // Calculate final score
    // Example formula:
    // score = reputation + environmental + (cash/1000) + (workers * 10) + (week/2)
    let score = Math.floor(startup.reputation 
                   + startup.environmental
                   + (startup.cash / 1000)
                   + (startup.workers * 10)
                   + (startup.week / 2));

    showModal(`Game Over! ${reason}\nFinal Score: ${score}`);
    nextWeekButton.disabled = true;
    decisionCancelSound.play();
  }

  const scenarios = [
    // 1. Push vs Pull Manufacturing (1st occurrence)
    {
      title: "Manufacturing Model Choice",
      description: "Choose between Pull (Just-In-Time) or Push production models for your EVs.",
      choices: [
        {
          text: "Pull Model",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 5);
            adjustStat('cash', 10000); // +£10,000
            adjustStat('week', 1);
            logEvent("You opt for Pull: Tailored production, no waste. +Rep, +Env, +£10k");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Push Model",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('environmental', -5);
            adjustStat('cash', -10000); // -£10,000
            adjustStat('week', 1);
            logEvent("You choose Push: Overproduction, storage costs. -Rep, -Env, -£10k");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 2. Push vs Pull Manufacturing (2nd occurrence)
    {
      title: "Revisiting Manufacturing Strategy",
      description: "Stable EV demand allows forecasting. Stick with Pull or go Push?",
      choices: [
        {
          text: "Pull Model",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 5);
            adjustStat('cash', 10000); // +£10,000
            adjustStat('week', 1);
            logEvent("Again, Pull pays off: +Rep, +Env, +£10k");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Push Model",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('environmental', -5);
            adjustStat('cash', -10000); // -£10,000
            adjustStat('week', 1);
            logEvent("Push again: costs rise, no R&D funds. -Rep, -Env, -£10k");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 3. Push vs Pull Manufacturing (3rd occurrence)
    {
      title: "Manufacturing Decision Once More",
      description: "Will you maintain Just-In-Time (Pull) or mass-produce (Push)?",
      choices: [
        {
          text: "Pull Model",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 5);
            adjustStat('cash', 10000); // +£10,000
            adjustStat('week', 1);
            logEvent("Pull again: less waste, more profit. +Rep, +Env, +£10k");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Push Model",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('environmental', -5);
            adjustStat('cash', -10000); // -£10,000
            adjustStat('week', 1);
            logEvent("Push: Excess stock. -Rep, -Env, -£10k");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 4. R&D Investment Opportunity
    {
      title: "R&D Investment",
      description: "Invest £10,000 in R&D? Do this 3 times total for a breakthrough.",
      choices: [
        {
          text: "Yes",
          onSelect: () => {
            adjustStat('cash', -10000); // -£10,000
            adjustStat('week', 1);
            logEvent("You invest in R&D: -£10k now for future gains.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No",
          onSelect: () => {
            adjustStat('week', 1);
            logEvent("You skip R&D investment, saving cash now but risking stagnation.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 5. Supplier Choice (Reliable vs Unreliable)
    {
      title: "Initial Supplier Choice",
      description: "Choose a reliable supplier (costly but stable) or unreliable (cheap but risky).",
      choices: [
        {
          text: "Reliable Supplier",
          onSelect: () => {
            adjustStat('reputation', 3);
            adjustStat('cash', -5000); // -£5,000
            adjustStat('week', 1);
            logEvent("Reliable supplier: stable deliveries, -£5k, +Rep");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Unreliable Supplier",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', 5000); // +£5,000
            adjustStat('week', 1);
            logEvent("Unreliable supplier: cheaper now (+£5k), future risk.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 6. Battery Disposal
    {
      title: "Disposal of Old Batteries",
      description: "Recycle properly (costly) or illegally dump?",
      choices: [
        {
          text: "Recycle",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 10);
            adjustStat('cash', -10000); // -£10,000
            adjustStat('week', 1);
            logEvent("Recycle: +Rep, +Env, -£10k for compliance.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Fly-Tip",
          onSelect: () => {
            adjustStat('reputation', -10);
            adjustStat('environmental', -10);
            adjustStat('cash', -20000); // -£20,000
            adjustStat('week', 1);
            logEvent("Fly-tip: Heavy fines, -Rep, -Env, -£20k.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 7. Side Panels Choice
    {
      title: "Source of Side Panels",
      description: "Choose sustainable but expensive panels or cheap unsustainable ones.",
      choices: [
        {
          text: "Sustainable Panels",
          onSelect: () => {
            adjustStat('reputation', 10);
            adjustStat('environmental', 10);
            adjustStat('cash', 5000); // +£5,000 (gov investment)
            adjustStat('week', 1);
            logEvent("Sustainable choice: +Rep, +Env, +£5k investment.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Cheap Panels",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('environmental', -5);
            adjustStat('cash', -10000); // -£10,000 fee
            adjustStat('week', 1);
            logEvent("Cheap panels: -Rep, -Env, -£10k due to penalties.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 8. Inventory Tracking
    {
      title: "Inventory Management System",
      description: "Implement tracking to prevent stockouts?",
      choices: [
        {
          text: "Track Inventory",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('cash', -5000); // -£5,000 cost
            adjustStat('week', 1);
            logEvent("Inventory tracking: better delivery, +Rep, -£5k.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No System",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', -10000); // -£10,000 due to stockouts and fixes
            adjustStat('week', 1);
            logEvent("No tracking: stockouts cost you -£10k and -Rep.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 9. Supplier Relationship Building
    {
      title: "Build Supplier Relationships",
      description: "Invest in stable specs and mutual trust with suppliers?",
      choices: [
        {
          text: "Yes",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('cash', -5000); // -£5,000 to invest in relationship
            adjustStat('week', 1);
            logEvent("Supplier ties: +Rep, -£5k for stable supply.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', -5000); // -£5,000 due to inefficiencies
            adjustStat('week', 1);
            logEvent("Ignoring suppliers: delays cost -Rep, -£5k.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 10. Massive Supply Chain Shock
    {
      title: "Global Supply Chain Shock",
      description: "Shortage hits. Buy expensive materials or wait it out?",
      choices: [
        {
          text: "Buy at High Cost",
          onSelect: () => {
            adjustStat('cash', -15000); // -£15,000
            adjustStat('week', 1);
            logEvent("You secure materials at high cost: -£15k.");
            eventNegativeSound.play();
            updateStats();
          }
        },
        {
          text: "Wait It Out",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', -5000); // -£5,000 lost sales
            adjustStat('week', 1);
            logEvent("You wait: lost sales, -Rep, -£5k.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 11. Design Infringement Claim
    {
      title: "Design Infringement Dispute",
      description: "A competitor claims you infringed their EV design. How to respond?",
      choices: [
        {
          text: "Settle Privately (£20k)",
          onSelect: () => {
            adjustStat('cash', -20000);
            adjustStat('week', 1);
            logEvent("Settled: -£20k, rep stable.");
            eventNegativeSound.play();
            updateStats();
          }
        },
        {
          text: "Defend in Court (£15k)",
          onSelect: () => {
            logEvent("Defend in court: -£15k, outcome uncertain.");
            adjustStat('cash', -15000);
            adjustStat('week', 1);
            eventNegativeSound.play();
            updateStats();
          }
        },
        {
          text: "License Design (£10k)",
          onSelect: () => {
            adjustStat('cash', -10000);
            adjustStat('week', 1);
            logEvent("License the design: -£10k now, stable rep, future royalties.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Ignore Claim",
          onSelect: () => {
            logEvent("Ignore: risk lawsuit, uncertain outcome.");
            adjustStat('week', 1);
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 12. Data Leak of Proprietary Algorithm
    {
      title: "Data Leak!",
      description: "Your proprietary algorithm was leaked. How do you respond?",
      choices: [
        {
          text: "Enhance Cybersecurity (£10k)",
          onSelect: () => {
            adjustStat('cash', -10000);
            adjustStat('reputation', 5);
            adjustStat('week', 1);
            logEvent("Security upgrade: -£10k, +Rep.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "File a Lawsuit (£15k)",
          onSelect: () => {
            adjustStat('cash', -15000);
            adjustStat('week', 1);
            logEvent("Lawsuit filed: -£15k, outcome uncertain.");
            eventNegativeSound.play();
            updateStats();
          }
        },
        {
          text: "Negotiate NDA (£5k)",
          onSelect: () => {
            adjustStat('cash', -5000);
            adjustStat('week', 1);
            logEvent("NDA signed: -£5k, rep stable.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Ignore Incident",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', -5000);
            adjustStat('week', 1);
            logEvent("Ignore: competitor profits, -Rep, -£5k lost sales.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 13. New Battery Recycling Process IP Decision
    {
      title: "New Recycling Process",
      description: "Patent, trade secret, sell, or do nothing?",
      choices: [
        {
          text: "File Patent (£8k)",
          onSelect: () => {
            adjustStat('cash', -8000);
            adjustStat('reputation', 5);
            adjustStat('environmental', 5);
            adjustStat('week', 1);
            logEvent("Patent: -£8k, +Rep, +Env.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Trade Secret (£3k)",
          onSelect: () => {
            adjustStat('cash', -3000);
            adjustStat('week', 1);
            logEvent("Trade secret: -£3k, no rep/env change.");
            eventNegativeSound.play();
            updateStats();
          }
        },
        {
          text: "Sell Innovation (£15k)",
          onSelect: () => {
            adjustStat('cash', 15000);
            adjustStat('reputation', 2);
            adjustStat('environmental', 2);
            adjustStat('week', 1);
            logEvent("Sold innovation: +£15k, +Rep, +Env, lose future control.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Do Nothing",
          onSelect: () => {
            adjustStat('reputation', -2);
            adjustStat('week', 1);
            logEvent("No action: competitors catch up, -Rep.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 14. After 1000 Sales: Reinvest or Holiday
    {
      title: "Profit After 1000 Sales",
      description: "You made profit. Reinvest or go on holiday?",
      choices: [
        {
          text: "Reinvest",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('cash', -5000); // Reinvestment costs £5k
            adjustStat('week', 1);
            logEvent("Reinvestment: Future growth, +Rep, -£5k");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Holiday",
          onSelect: () => {
            adjustStat('reputation', -3);
            adjustStat('week', 1);
            logEvent("Holiday: missed growth, -Rep, no cash change.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 15. Massive Marketing Party
    {
      title: "Marketing Party",
      description: "Throw a big (expensive) marketing event?",
      choices: [
        {
          text: "Yes, Party!",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('cash', -10000); // -£10k party cost
            adjustStat('week', 1);
            logEvent("Big party: +Rep, -£10k costs.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No Party",
          onSelect: () => {
            adjustStat('reputation', -2);
            adjustStat('week', 1);
            logEvent("No party: save cash, but -Rep from lower brand visibility.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 16. Usage-Based Charging Service
    {
      title: "Usage-Based Charging",
      description: "Offer a service for continuous charger use at a set fee?",
      choices: [
        {
          text: "Yes",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 3);
            adjustStat('cash', 5000); // +£5k new revenue
            adjustStat('week', 1);
            logEvent("New service: +Rep, +Env, +£5k revenue.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No",
          onSelect: () => {
            adjustStat('week', 1);
            logEvent("No new service: missed ongoing revenue.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 17. Free Software Updates
    {
      title: "Free Software Updates",
      description: "Offer free efficiency updates to customers?",
      choices: [
        {
          text: "Yes",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 2);
            adjustStat('week', 1);
            logEvent("Free updates: +Rep, +Env, loyalty rises.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', -2000); // Lose some sales £2k
            adjustStat('week', 1);
            logEvent("No updates: loyalty drops, -Rep, lose £2k in future sales.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 18. Additional R&D Spending
    {
      title: "Extra R&D for Best Mileage",
      description: "Invest more in R&D and raise product price?",
      choices: [
        {
          text: "Yes",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 5);
            adjustStat('cash', -10000); // -£10,000 investment
            adjustStat('week', 1);
            logEvent("Extra R&D: Future-leading tech, +Rep, +Env, -£10k now.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "No",
          onSelect: () => {
            adjustStat('week', 1);
            logEvent("No extra R&D: remain average, stable but no growth.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 19. Merger & Acquisition
    {
      title: "Merger & Acquisition Proposal",
      description: "Merge with another company to expand IP and innovation?",
      choices: [
        {
          text: "Merge",
          onSelect: () => {
            adjustStat('reputation', 5);
            adjustStat('environmental', 2);
            adjustStat('cash', 5000); // +£5k synergy
            adjustStat('week', 1);
            logEvent("M&A: Expanded IP, +Rep, +Env, +£5k synergy.");
            eventPositiveSound.play();
            updateStats();
          }
        },
        {
          text: "Stay Independent",
          onSelect: () => {
            adjustStat('reputation', -2);
            adjustStat('week', 1);
            logEvent("No merger: you keep control, -Rep for missed synergy.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    },
  
    // 20. Financial Shock - Cashflow Crisis
    {
      title: "Cashflow Crisis",
      description: "Take a high-interest loan or downsize?",
      choices: [
        {
          text: "Loan",
          onSelect: () => {
            adjustStat('cash', 10000); // +£10,000 immediate cash
            adjustStat('week', 1);
            logEvent("Loan taken: +£10k now, long-term costs later.");
            eventNegativeSound.play();
            updateStats();
          }
        },
        {
          text: "Downsize",
          onSelect: () => {
            adjustStat('reputation', -5);
            adjustStat('cash', 5000); // +£5,000 saved from downsizing
            adjustStat('workers', -2);
            adjustStat('week', 1);
            logEvent("Downsizing: +£5k short-term, -Rep, fewer workers.");
            eventNegativeSound.play();
            updateStats();
          }
        }
      ]
    }
  ];
  
  // Mini-game logic remains the same, but after each minigame completion, also call checkEndConditions().

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
      adjustStat('cash', 5000);
      eventPositiveSound.play();
    } else {
      logEvent("That wasn't the faulty part!");
      eventNegativeSound.play();
    }
    updateStats();
    checkEndConditions();
  }

  function handleMinigame1Timeout() {
    minigamePopup.classList.add("hidden");
    logEvent("Time’s up! Failed to identify the issue.");
    adjustStat('reputation', -5);
    adjustStat('cash', -5000);
    eventNegativeSound.play();
    updateStats();
    checkEndConditions();
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
        span.style.visibility = "hidden";
      };
      investmentGrid.appendChild(span);
    }

    investmentPopup.classList.remove("hidden");
    investmentTimeout = setTimeout(() => {
      handleMinigame2Timeout();
    }, 3000); 
  }

  function handleMinigame2Timeout() {
    investmentPopup.classList.add("hidden");
    let fundingGain = clickedBags * 2000;
    if (fundingGain > 0) {
      logEvent(`You collected ${clickedBags} money bags! Gained £${fundingGain.toLocaleString()}.`);
      adjustStat('cash', fundingGain);
      eventPositiveSound.play();
    } else {
      logEvent("No bags collected in time, no extra funding gained.");
      eventNegativeSound.play();
    }
    updateStats();
    checkEndConditions();
  }

  // Mini-Game 3: Environmental Task
  let miniGameCount3 = 0;
  const maxMiniGames3 = 2;
  let envTimeout;
  let clickedRecycle = 0;
  let clickedTrash = 0;

  function triggerMinigame3() {
    if (miniGameCount3 >= maxMiniGames3) return;
    miniGameCount3++;
    showMinigame3();
  }

  function showMinigame3() {
    envMinigameGrid.innerHTML = "";
    clickedRecycle = 0;
    clickedTrash = 0;

    const totalItems = 16;
    for (let i=0; i<totalItems; i++) {
      const isRecycle = Math.random() < 0.5;
      const span = document.createElement("span");
      span.innerText = isRecycle ? "♻️" : "🗑️";
      span.onclick = () => {
        if (span.innerText === "♻️") {
          clickedRecycle++;
          span.style.visibility = "hidden";
        } else {
          clickedTrash++;
          span.style.visibility = "hidden";
        }
      };
      envMinigameGrid.appendChild(span);
    }

    envMinigamePopup.classList.remove("hidden");
    envTimeout = setTimeout(() => {
      handleMinigame3Timeout();
    }, 5000); 
  }

  function handleMinigame3Timeout() {
    envMinigamePopup.classList.add("hidden");
    let sustainabilityGain = clickedRecycle * 2;
    let fundingGain = clickedRecycle * 500;
    let reputationLoss = clickedTrash;

    if (clickedRecycle > 0) {
      logEvent(`You processed ${clickedRecycle} recyclable items! +${sustainabilityGain} Env, +£${fundingGain}`);
      adjustStat('environmental', sustainabilityGain);
      adjustStat('cash', fundingGain);
    } else {
      logEvent("No recyclable items processed.");
    }

    if (clickedTrash > 0) {
      logEvent(`You incorrectly handled ${clickedTrash} trash bins! -${reputationLoss} Rep`);
      adjustStat('reputation', -reputationLoss);
    }

    eventPositiveSound.play();
    updateStats();
    checkEndConditions();
  }

  startButton.addEventListener("click", () => {
    const chosenName = carNameInput.value.trim() || "Tech Startup";
    startup = new Startup(chosenName);
    document.getElementById("stat-name").innerText = startup.name;
    startScreen.style.display = "none";

    document.getElementById("central-company-name").innerText = startup.name;


    backgroundMusic.play().catch((err) => {
      console.log("User gesture required to start music:", err);
    });
    updateStats();
  });

  nextWeekButton.addEventListener("click", () => {
    // Advance one week
    adjustStat('week', 1);
    logEvent(`📅 Week ${startup.week}: Another week passes...`);

    // Mini-game triggers at weeks 15,30 for MG1; 45,60 MG2; 75,90 MG3
    if ((startup.week === 15 || startup.week === 30) && miniGameCount1 < 2) {
      triggerMinigame1();
    } else if ((startup.week === 45 || startup.week === 60) && miniGameCount2 < 2) {
      triggerMinigame2();
    } else if ((startup.week === 75 || startup.week === 90) && miniGameCount3 < 2) {
      triggerMinigame3();
    } else {
      // Normal scenario
      randomEvent();
    }

    updateStats();
    if (!checkEndConditions()) {
      // Check if reached end of 2 years
      if (startup.week >= MAX_WEEK) {
        endGame("You survived 2 years!");
      }
    }
  });

  function randomEvent() {
    if (scenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      const scenario = scenarios[randomIndex];
      showChoices(scenario.title, scenario.description, scenario.choices);
    } else {
      logEvent("No scenario available this week.");
    }
  }
});
