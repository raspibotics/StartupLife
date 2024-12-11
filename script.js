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

  if (!popup || !popupMessage || !yesButton || !noButton || !nextMonthButton || !modal || !modalMessage || !modalOk) {
    console.error("One or more critical elements are missing from the DOM.");
    return;
  }

  function showDecision(message, callback) {
    popupMessage.innerText = message;
    popup.classList.remove("hidden");

    yesButton.onclick = () => {
      callback(true);
      popup.classList.add("hidden");
      decisionConfirmSound.play();
    };

    noButton.onclick = () => {
      callback(false);
      popup.classList.add("hidden");
      decisionCancelSound.play();
    };
  }

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

  class Startup {
    constructor(name) {
      this.name = name;
      this.months = 0;
      this.funding = 100000; 
      this.reputation = 50;
      this.teamSize = 2;
      this.productProgress = 0;

      // Additional stats
      this.teamMorale = 100;
      this.inventoryLevel = 50;
      this.supplyReliability = 70;
      this.ipProtection = 50;
      this.sustainability = 50;
    }
  }

  const startupName = prompt("Enter your startup's name:") || "Tech Startup";
  const startup = new Startup(startupName);
  document.getElementById("stat-name").innerText = startup.name;

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

    // Log extra stats to console for now
    console.log(`Morale: ${startup.teamMorale}% | Inventory: ${startup.inventoryLevel}% | Supply Reliability: ${startup.supplyReliability}% | IP Protection: ${startup.ipProtection}% | Sustainability: ${startup.sustainability}%`);
  }

  function logEvent(message) {
    const log = document.getElementById("event-log");
    const logEntry = document.createElement("p");
    logEntry.innerText = message;
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
  }

  // 20 Scenarios Implementation
  // Each scenario is a function that handles conditions, shows decisions, and updates stats.
  const scenarios = [

    // 1. Investor Pitch for Modular Battery Packs
    () => {
      logEvent("💸 An investor is interested in your modular battery pack approach!");
      showDecision("Pitch your idea to the investor?", (yes) => {
        if (yes) {
          const successChance = startup.teamMorale > 60 && startup.productProgress > 30 ? 0.8 : 0.4;
          if (Math.random() < successChance) {
            const fundingGain = 30000;
            adjustStat('funding', fundingGain);
            adjustStat('reputation', 5, 0, 100);
            logEvent(`"You pitched your innovative design. The investor loved it, granting $30,000! Reputation up."`);
            eventPositiveSound.play();
          } else {
            logEvent(`"Your pitch fell flat. No funding gained and your reputation suffers slightly."`);
            adjustStat('reputation', -5, 0, 100);
            eventNegativeSound.play();
          }
        } else {
          logEvent(`"You skipped the pitch, missing a potential funding opportunity."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 2. Sustainable Materials Supplier Change
    () => {
      logEvent("🌱 A supplier offers sustainably sourced side panels at a higher cost.");
      showDecision("Use the sustainable but costly supplier?", (yes) => {
        if (yes) {
          adjustStat('funding', -5000);
          adjustStat('sustainability', 10, 0, 100);
          adjustStat('supplyReliability', 10, 0, 100);
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You chose the greener supplier. Costs rose by $5,000, but sustainability and reliability improved!"`);
          eventPositiveSound.play();
        } else {
          adjustStat('sustainability', -10, 0, 100);
          adjustStat('reputation', -5, 0, 100);
          logEvent(`"You stuck with the cheaper supplier. Critics question your eco-credentials."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 3. Battery Recycling vs. Illegal Disposal
    () => {
      logEvent("♻️ You have old EV batteries to dispose of.");
      showDecision("Recycle properly (costly) or dump illegally?", (yes) => {
        if (yes) {
          adjustStat('funding', -8000);
          adjustStat('sustainability', 15, 0, 100);
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You paid for proper recycling. Environmental groups applaud your ethics. Reputation and sustainability rise."`);
          eventPositiveSound.play();
        } else {
          adjustStat('funding', -20000);
          adjustStat('reputation', -20, 0, 100);
          adjustStat('sustainability', -20, 0, 100);
          // Optional: Add a penalty like a delay, but we'll skip for simplicity
          logEvent(`"You tried to dump the batteries. Heavy fines and bad press follow, hurting your finances and reputation."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 4. Overtime Crunch for Software Update
    () => {
      logEvent("👨‍💻 A critical software update can be finished faster with overtime.");
      showDecision("Push the team to work overtime?", (yes) => {
        if (yes) {
          adjustStat('teamMorale', -15, 0, 100);
          adjustStat('productProgress', 10, 0, 100);
          logEvent(`"Your team pulls an all-nighter, boosting progress by 10% but morale drops."`);
          eventNegativeSound.play();
        } else {
          adjustStat('teamMorale', 5, 0, 100);
          logEvent(`"You spare the team. No progress gain, but morale improves."`);
          eventPositiveSound.play();
        }
        updateStats();
      });
    },

    // 5. IP Infringement Threat
    () => {
      logEvent("🔐 A rival startup may copy your EV design due to weak IP protection.");
      showDecision("Invest in IP defense?", (yes) => {
        if (yes) {
          adjustStat('funding', -10000);
          adjustStat('ipProtection', 20, 0, 100);
          logEvent(`"You bolstered IP protection. The rival backs off. Your designs remain unique."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -10, 0, 100);
          adjustStat('productProgress', -5, 0, 100);
          logEvent(`"You ignored the threat. The rival launches a similar product first, hurting your rep and progress."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 6. Marketing Campaign for Charger Network
    () => {
      logEvent("📣 A marketing firm suggests highlighting your EV charger network.");
      showDecision("Launch the marketing campaign?", (yes) => {
        if (yes) {
          adjustStat('funding', -5000);
          adjustStat('reputation', 10, 0, 100);
          logEvent(`"Your campaign succeeds. Reputation rises as customers appreciate the charging network."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -5, 0, 100);
          logEvent(`"You skip the campaign. Competitors hog the spotlight, slightly harming your brand visibility."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 7. Merger with Battery Recycling Firm
    () => {
      logEvent("🤝 A battery recycling firm proposes a partial merger.");
      showDecision("Proceed with the merger?", (yes) => {
        if (yes && startup.sustainability > 50 && startup.productProgress > 40) {
          adjustStat('funding', 10000);
          adjustStat('sustainability', 10, 0, 100);
          adjustStat('ipProtection', -5, 0, 100);
          logEvent(`"You merge resources, gaining $10,000 and eco-credibility, but share some IP secrets."`);
          eventPositiveSound.play();
        } else if (yes) {
          // If conditions not fully met, lesser benefit
          adjustStat('funding', 5000);
          adjustStat('sustainability', 5, 0, 100);
          logEvent(`"You merge, but since not fully ready, benefits are modest. Still, some sustainability gain."`);
          eventPositiveSound.play();
        } else {
          logEvent(`"You remain independent, preserving IP but missing synergy gains."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 8. Government Grant for Cleaner Manufacturing
    () => {
      logEvent("🏛️ Government offers a green manufacturing grant.");
      showDecision("Adopt cleaner manufacturing methods?", (yes) => {
        if (yes && startup.sustainability > 70) {
          adjustStat('funding', 15000);
          adjustStat('productProgress', 5, 0, 100);
          adjustStat('sustainability', 5, 0, 100);
          logEvent(`"Your high sustainability score earns you a generous grant. Funding and progress increase!"`);
          eventPositiveSound.play();
        } else if (yes) {
          // If not very sustainable yet, smaller gain
          adjustStat('funding', 5000);
          adjustStat('sustainability', 5, 0, 100);
          logEvent(`"You get a smaller grant. Still, it's a step forward."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -5, 0, 100);
          logEvent(`"You reject the grant. Some criticize your lack of ambition."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 9. Data Breach Attempt
    () => {
      logEvent("💻 Hackers target your EV telemetry data!");
      showDecision("Invest in stronger cybersecurity?", (yes) => {
        if (yes) {
          adjustStat('funding', -7000);
          adjustStat('ipProtection', 20, 0, 100);
          logEvent(`"You upgraded security, thwarting hackers. Customer trust remains intact."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -10, 0, 100);
          adjustStat('ipProtection', -10, 0, 100);
          logEvent(`"Data breach successful. Customers and media are outraged at the lax security."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 10. Quality Check on Interior Materials
    () => {
      logEvent("🧩 A batch of interior panels looks subpar.");
      showDecision("Replace inferior panels?", (yes) => {
        if (yes && startup.supplyReliability < 50) {
          adjustStat('funding', -5000);
          adjustStat('reputation', 10, 0, 100);
          logEvent(`"You replace the panels, ensuring quality. Customers appreciate the integrity."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', -2000);
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You fix the quality issue at a lower cost. Reputation improves slightly."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -15, 0, 100);
          adjustStat('productProgress', 5, 0, 100);
          logEvent(`"You use the cheap panels, speeding production but damaging your reputation."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 11. Just-In-Time Manufacturing Decision
    () => {
      logEvent("⏱️ Inventory is low. A consultant suggests Just-In-Time (JIT) manufacturing.");
      showDecision("Adopt JIT?", (yes) => {
        if (yes && startup.inventoryLevel < 30) {
          adjustStat('funding', -3000);
          adjustStat('supplyReliability', 10, 0, 100);
          adjustStat('inventoryLevel', 10, 0, 100);
          logEvent(`"JIT reduces waste and stabilizes inventory. It's a smart move given low stock."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', -2000);
          adjustStat('supplyReliability', 5, 0, 100);
          logEvent(`"You implement JIT. Modest improvements in efficiency."`);
          eventPositiveSound.play();
        } else {
          adjustStat('sustainability', -5, 0, 100);
          adjustStat('inventoryLevel', -5, 0, 100);
          logEvent(`"You keep bulk ordering. Waste and management issues persist, harming your green image."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 12. R&D on Faster Charging Tech
    () => {
      logEvent("⚡ Engineers propose new fast-charging tech for your EVs.");
      showDecision("Invest in the new R&D?", (yes) => {
        if (yes && startup.productProgress > 60) {
          adjustStat('funding', -10000);
          adjustStat('productProgress', 10, 0, 100);
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You invest heavily. Your EV charging surpasses competitors, increasing excitement and prestige."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', -5000);
          adjustStat('productProgress', 5, 0, 100);
          logEvent(`"Limited R&D push improves efficiency slightly, but not groundbreaking."`);
          eventPositiveSound.play();
        } else {
          logEvent(`"You skip the R&D. Nothing changes, but you miss a chance to innovate."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 13. Home Charger Giveaway Promotion
    () => {
      logEvent("🏠 Consider offering free home chargers with purchase to boost rep.");
      showDecision("Offer free home chargers?", (yes) => {
        if (yes && startup.reputation < 50) {
          adjustStat('funding', -5000);
          adjustStat('reputation', 10, 0, 100);
          logEvent(`"You offer free chargers. Customers love the deal, boosting your brand appeal."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', -5000);
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You still gain a small boost in goodwill, though your rep was already decent."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -5, 0, 100);
          logEvent(`"You skip the promotion. Some potential customers feel let down."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 14. Supplier Fails to Deliver Key Batteries
    () => {
      if (startup.supplyReliability < 40) {
        logEvent("🚚 Your battery shipment is delayed! No choice given.");
        adjustStat('funding', -10000);
        adjustStat('inventoryLevel', 5, 0, 100); // Emergency purchase stabilizes inventory slightly
        adjustStat('reputation', -5, 0, 100);
        logEvent(`"Your supplier let you down. Emergency supplies cost $10,000 and hurt your rep slightly."`);
        eventNegativeSound.play();
        updateStats();
      } else {
        // If reliability not low, fallback simpler event
        logEvent("🛠️ Minor supply hiccup, quickly resolved. No major impact.");
        eventPositiveSound.play();
        updateStats();
      }
    },

    // 15. Team Morale Event: Repetitive Overwork
    () => {
      logEvent("😓 Team morale is suffering due to repetitive overtime.");
      showDecision("Host a team retreat to boost morale?", (yes) => {
        if (yes && startup.teamMorale < 40) {
          adjustStat('funding', -2000);
          adjustStat('teamMorale', 20, 0, 100);
          // Potential delayed effect if you want to track next month
          adjustStat('productProgress', 5, 0, 100);
          logEvent(`"Team retreat rejuvenates the crew. Morale +20 and a future productivity bump."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', -2000);
          adjustStat('teamMorale', 10, 0, 100);
          logEvent(`"Retreat helps but team wasn’t too unhappy. Still, a nice morale boost."`);
          eventPositiveSound.play();
        } else {
          adjustStat('teamMorale', -10, 0, 100);
          // Potential future product progress penalty could be applied next month if desired
          logEvent(`"You ignore morale issues. Motivation drops further, risking slower progress."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 16. Foreign Market Expansion
    () => {
      logEvent("🌍 A chance to expand into a foreign market appears.");
      showDecision("Expand internationally?", (yes) => {
        if (yes && startup.reputation > 60) {
          adjustStat('funding', 10000);
          adjustStat('reputation', 5, 0, 100);
          adjustStat('ipProtection', -5, 0, 100);
          logEvent(`"You expand overseas, gaining new customers and funds, but exposing your IP to new risks."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', 5000);
          logEvent(`"Limited success abroad. Some new funds, but not a huge impact."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -5, 0, 100);
          logEvent(`"You reject expansion. Critics label you as timid."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 17. Big Order from a Fleet Operator
    () => {
      logEvent("🚛 A fleet operator wants to pre-order 200 EVs.");
      showDecision("Fulfill the large order?", (yes) => {
        if (yes && startup.productProgress > 80) {
          adjustStat('funding', 20000);
          adjustStat('inventoryLevel', -10, 0, 100);
          adjustStat('teamMorale', 5, 0, 100);
          adjustStat('productProgress', -5, 0, 100);
          logEvent(`"You secured a big contract! More funds and morale boost, but it slightly diverts product focus."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', 10000);
          logEvent(`"You take the order, but since product isn't that far along, the deal is less optimal."`);
          eventPositiveSound.play();
        } else {
          adjustStat('reputation', -10, 0, 100);
          logEvent(`"You decline the deal. Potential customers think you can't scale up."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 18. Electric Grid Partnership for Charging Stations
    () => {
      logEvent("🔌 A power company offers a renewable energy partnership for your charging stations.");
      showDecision("Partner with the green energy supplier?", (yes) => {
        if (yes && startup.sustainability > 60) {
          adjustStat('funding', 5000);
          adjustStat('sustainability', 10, 0, 100);
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You partner with a renewable supplier, gaining subsidies, green cred, and happy customers."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('funding', 2000);
          adjustStat('sustainability', 5, 0, 100);
          logEvent(`"Partnership yields some benefits, but less impactful due to moderate sustainability."`);
          eventPositiveSound.play();
        } else {
          adjustStat('sustainability', -10, 0, 100);
          logEvent(`"You pass on the deal. Environmental advocates are disappointed."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    },

    // 19. Supplier Merger Shocks Market (Massive Shock)
    () => {
      if (startup.months > 18 || startup.productProgress > 90) {
        logEvent("🌩️ A massive supplier merger disrupts your supply chain!");
        adjustStat('funding', -15000);
        adjustStat('supplyReliability', -20, 0, 100);
        logEvent(`"Costs rise, reliability drops. You scramble to maintain production amidst industry turmoil."`);
        eventNegativeSound.play();
      } else {
        // Early fallback
        logEvent("👨‍💻 Minor industry rumor worries you, but no big impact yet.");
        eventPositiveSound.play();
      }
      updateStats();
    },

    // 20. Customer Satisfaction Survey
    () => {
      logEvent("📊 Customers rave about your EVs in a satisfaction survey!");
      showDecision("Publicize the positive survey results?", (yes) => {
        if (yes && startup.reputation > 70 && startup.sustainability > 50) {
          adjustStat('reputation', 10, 0, 100);
          adjustStat('funding', 5000);
          logEvent(`"You share the stellar survey results, boosting reputation further and increasing sales."`);
          eventPositiveSound.play();
        } else if (yes) {
          adjustStat('reputation', 5, 0, 100);
          logEvent(`"You publicize the results. Mild reputation boost as new customers show interest."`);
          eventPositiveSound.play();
        } else {
          logEvent(`"You keep the results internal. Loyal fans are happy, but you miss out on broader gains."`);
          eventNegativeSound.play();
        }
        updateStats();
      });
    }

  ];

  function randomEvent() {
    const randomIndex = Math.floor(Math.random() * scenarios.length);
    scenarios[randomIndex]();
  }

  nextMonthButton.addEventListener("click", () => {
    startup.months++;
    logEvent(`📅 Month ${startup.months}: Your startup continues...`);
    randomEvent();
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

  updateStats();
});
