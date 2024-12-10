# Load the files to modify the game as described
index_path = "index.html"
script_path = "script.js"
style_path = "style.css"

# Reading content to make the necessary updates
with open(index_path, 'r') as f:
    index_content = f.read()

with open(script_path, 'r') as f:
    script_content = f.read()

with open(style_path, 'r') as f:
    style_content = f.read()

# Update process begins here. For the UI updates:
# 1. Add modal placeholder and required structure in the index.html
# 2. Replace alerts and confirms with modal logic in script.js
# 3. Add CSS for modal, buttons, and event log auto-scroll in style.css

# Update index.html with a modal container
updated_index_content = index_content.replace(
    "</body>",
    """
    <div id="modal" class="modal hidden">
      <div class="modal-content">
        <p id="modal-message"></p>
        <div class="modal-buttons">
          <button id="modal-ok">OK</button>
          <button id="modal-cancel" class="hidden">Cancel</button>
        </div>
      </div>
    </div>
    </body>
    """
)

# Update script.js to include modal functionality and autoscroll for the event log
updated_script_content = script_content.replace(
    "alert",
    """
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
    """
).replace("confirm", "showModal")

# Adding auto-scroll to logEvent function
updated_script_content = updated_script_content.replace(
    "log.appendChild(logEntry);",
    """
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
    """
)

# Add CSS for the modal and update buttons in style.css
updated_style_content = style_content + """
/* Modal styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal.hidden {
  display: none;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-buttons button {
  margin: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

#modal-ok {
  background-color: #28a745;
  color: white;
}

#modal-cancel {
  background-color: #dc3545;
  color: white;
}

/* Updated button styles */
button {
  background: linear-gradient(to right, #007BFF, #0056b3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: linear-gradient(to right, #0056b3, #007BFF);
}

/* Event log auto-scroll */
#event-log {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
"""

# Further refine and update the files to include a stylized custom decision popup

# Update index.html to include a decision popup container
updated_index_content = updated_index_content.replace(
    "</body>",
    """
    <div id="decision-popup" class="popup hidden">
      <div class="popup-content">
        <p id="popup-message"></p>
        <div class="popup-buttons">
          <button id="popup-yes">Yes</button>
          <button id="popup-no">No</button>
        </div>
      </div>
    </div>
    </body>
    """
)

# Update script.js to handle decision-based modals
decision_popup_logic = """
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
"""

# Add the new function to the script and replace confirm() in decision-based logic
updated_script_content = updated_script_content.replace(
    "function showModal",
    decision_popup_logic + "\nfunction showModal"
).replace(
    "if (confirm",
    "showDecision"
)

# Update style.css to style the decision popup
updated_style_content += """
/* Popup styling */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup.hidden {
  display: none;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 80%;
}

.popup-buttons button {
  margin: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

#popup-yes {
  background-color: #28a745;
  color: white;
}

#popup-no {
  background-color: #dc3545;
  color: white;
}
"""

# Adjust the CSS to ensure visibility of the buttons and proper z-index for the modal/popup

# Update the modal and popup styles with stronger visibility rules and default button styling
visibility_fixes = """
/* Ensure modal and popup are visible above all elements */
.modal, .popup {
  z-index: 9999;
}

/* Default button styles for visibility */
.popup-buttons button, .modal-buttons button {
  display: inline-block;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

/* Button hover effects for better UX */
#modal-ok:hover, #popup-yes:hover {
  background-color: #218838;
}

#modal-cancel:hover, #popup-no:hover {
  background-color: #c82333;
}
"""

# Append fixes to the CSS content
updated_style_content += visibility_fixes



# Write the updated files back
with open(index_path, 'w') as f:
    f.write(updated_index_content)

with open(script_path, 'w') as f:
    f.write(updated_script_content)

with open(style_path, 'w') as f:
    f.write(updated_style_content)

# Outputs are saved and ready for testing.
"Files have been updated successfully."
