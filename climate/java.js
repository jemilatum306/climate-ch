// script.js

// Function to show/hide info bubbles for causes
function showInfo(causeId) {
    const infoElement = document.getElementById(causeId + "-info");
    // Simple toggle, real implementation might need to hide others
    if (infoElement.style.display === "none" || infoElement.style.display === "") {
        infoElement.style.display = "block";
    } else {
        infoElement.style.display = "none";
    }
}

// Function to toggle pollution information
function togglePollutionInfo(infoId) {
    const infoDiv = document.getElementById(infoId);
    if (infoDiv.style.display === "block") {
        infoDiv.style.display = "none";
    } else {
        // Hide other open info divs in this section if any
        document.querySelectorAll('.pollution-info').forEach(div => div.style.display = 'none');
        infoDiv.style.display = "block";
        infoDiv.style.animation = "fadeIn 0.5s"; // Add a little animation
    }
}


// Function to show pledge input (conceptual)
function showPledge() {
    const pledgeText = prompt("What's one small change you commit to making this week to help combat climate change and pollution?");
    if (pledgeText && pledgeText.trim() !== "") {
        const pledgeDisplay = document.getElementById('pledge-display');
        pledgeDisplay.textContent = `Your Pledge: "${pledgeText}" - Great commitment!`;
        pledgeDisplay.style.display = 'block';
    } else if (pledgeText !== null) { // User pressed OK but field was empty
        alert("Please enter a pledge if you'd like to make one!");
    }
}

// Function to check simple radio button quizzes
function checkQuiz(quizId, correctAnswer) {
    const quizForm = document.getElementById(quizId);
    const feedbackElement = document.getElementById(quizId + "-feedback");
    const userAnswer = quizForm.querySelector(`input[name="${quizForm.id.replace('quiz', 'q')}"]:checked`);

    if (userAnswer) {
        if (userAnswer.value === correctAnswer) {
            feedbackElement.textContent = "Correct! Well done!";
            feedbackElement.className = "feedback correct";
        } else {
            feedbackElement.textContent = "Not quite. The correct answer was option " + correctAnswer.toUpperCase() + ". Keep learning!";
            feedbackElement.className = "feedback incorrect";
        }
    } else {
        feedbackElement.textContent = "Please select an answer.";
        feedbackElement.className = "feedback incorrect";
    }
}


// Drag and Drop Quiz Logic (Simplified)
let draggedItem = null;
const correctMatches = {
    "drag1": "Impact: Traps Heat (Greenhouse Effect)",
    "drag2": "Impact: Potent Short-Lived Climate Pollutant",
    "drag3": "Impact: Reduces Earth's Carbon Absorption"
};
let userMatches = {}; // To store what user dropped where

document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const droptargets = document.querySelectorAll('.droptarget');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.style.display = 'none'; // Hide original while dragging
            }, 0);
        });

        draggable.addEventListener('dragend', (e) => {
            setTimeout(() => {
                e.target.style.display = 'block'; // Show original if not dropped successfully
                draggedItem = null;
            }, 0);
        });
    });

    droptargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            target.classList.add('over');
        });

        target.addEventListener('dragleave', (e) => {
            target.classList.remove('over');
        });

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('over');
            if (draggedItem && !target.hasChildNodes()) { // Prevent dropping multiple items in one target
                const originalText = target.textContent; // Store original text
                target.textContent = ''; // Clear placeholder text
                target.appendChild(draggedItem.cloneNode(true)); // Append a clone
                draggedItem.style.display = 'block'; // Make original draggable item visible again or remove it if preferred

                // Store the match
                userMatches[target.dataset.match] = draggedItem.id;
                // Optionally, remove the dragged item from its original list or disable it
                // For this simple version, we'll just let it be re-draggable
            } else if (draggedItem && target.hasChildNodes()) {
                // If target already has an item, allow replacing it
                const existingChild = target.firstChild;
                // (Optional: move existingChild back to drag-options or handle as per UX design)
                target.innerHTML = ''; // Clear existing
                target.appendChild(draggedItem.cloneNode(true));
                draggedItem.style.display = 'block';
                userMatches[target.dataset.match] = draggedItem.id;
            }
        });
    });
});


function checkDragDropQuiz() {
    const feedbackEl = document.getElementById('drag-drop-feedback');
    let correctCount = 0;
    let totalQuestions = Object.keys(correctMatches).length; // Should be 3

    const dropTargets = document.querySelectorAll('.droptarget');
    dropTargets.forEach(target => {
        const droppedItem = target.querySelector('.draggable');
        if (droppedItem) {
            // The data-match on the target should correspond to the ID of the correct draggable
            // And the ID of the dropped item should be that correct draggable's ID.
            // correctMatches maps the correct draggable ID (e.g., 'drag1') to the target's expected content (which we simplify to the target's unique ID here)
            // Let's re-think: we need to map the target to the correct draggable ID.
            // The `data-match` attribute on the target *is* the ID of the correct draggable item.
            if (target.dataset.match === droppedItem.id) {
                correctCount++;
                target.style.borderColor = 'green'; // Visual feedback
            } else {
                target.style.borderColor = 'red'; // Visual feedback
            }
        } else {
            target.style.borderColor = 'red'; // Nothing dropped here
        }
    });


    if (correctCount === totalQuestions) {
        feedbackEl.textContent = "Excellent! All matches are correct!";
        feedbackEl.className = "feedback correct";
    } else {
        feedbackEl.textContent = `You got ${correctCount} out of ${totalQuestions} correct. Try again! (Refresh to reset drag & drop for now)`;
        feedbackEl.className = "feedback incorrect";
    }
     // Note: For a better UX, you'd add a reset button for the drag and drop quiz.
     // Currently, users would need to refresh to fully reset the draggable items if they are hidden/moved.
}

// Add touch support for cause items to show info bubbles on tap for mobile
document.addEventListener('DOMContentLoaded', () => {
    const causeItems = document.querySelectorAll('.cause-item');
    causeItems.forEach(item => {
        item.addEventListener('touchstart', function(event) {
            // Prevent a click event from firing immediately after
            event.preventDefault();
            // Toggle a class that CSS can use to show the bubble
            // And ensure only one bubble is shown at a time
            causeItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.classList.remove('hover');
                    const otherInfo = otherItem.querySelector('.info-bubble');
                    if(otherInfo) otherInfo.style.display = 'none';
                }
            });
            this.classList.toggle('hover');
            const infoBubble = this.querySelector('.info-bubble');
            if (infoBubble) {
                infoBubble.style.display = this.classList.contains('hover') ? 'block' : 'none';
            }
        });
    });
});