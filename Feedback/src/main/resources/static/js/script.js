// API endpoints
const API_BASE_URL = "http://localhost:8080/api"; // Adjust to match your backend API

// Function to submit feedback
async function submitFeedback(event) {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const feedback = document.getElementById("feedback").value.trim();

  // Validate input
  if (!name || !feedback || !validateEmail(email)) {
    showMessage("Please fill in all fields correctly.", "danger");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, feedback }),
    });

    if (!response.ok) throw new Error("Failed to submit feedback");

    document.getElementById("feedbackForm").reset();
    showMessage("Feedback submitted successfully!", "success");
    fetchFeedback();
  } catch (error) {
    showMessage(error.message, "danger");
  }
}

// Function to fetch feedback
async function fetchFeedback() {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    const feedbackList = await response.json();
    displayFeedback(feedbackList);
  } catch (error) {
    showMessage("Failed to load feedback.", "danger");
  }
}

// Function to display feedback
function displayFeedback(feedbackList) {
  const feedbackListElement = document.getElementById("feedbackList");
  feedbackListElement.innerHTML = ""; // Clear existing feedback

  feedbackList.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item feedback-item";
    li.innerHTML = `
            <div class="feedback-content">
                <strong>${item.name}</strong><br>
                <small>${item.feedback}</small><br>
                <small class="feedback-date">${new Date(
                  item.date
                ).toLocaleString()}</small>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteFeedback('${
              item.id
            }')">Delete</button>
        `;
    feedbackListElement.appendChild(li);
  });
}

// Function to delete feedback
async function deleteFeedback(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete feedback");

    fetchFeedback();
    showMessage("Feedback deleted successfully!", "success");
  } catch (error) {
    showMessage(error.message, "danger");
  }
}

// Function to validate email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Function to display messages
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.className = `alert alert-${type}`;
  messageDiv.textContent = message;
  messageDiv.classList.remove("d-none");

  setTimeout(() => {
    messageDiv.classList.add("d-none");
  }, 3000);
}

// Event listeners
document
  .getElementById("feedbackForm")
  .addEventListener("submit", submitFeedback);
window.onload = fetchFeedback;

// Real-time validation for name input
document.getElementById("name").addEventListener("input", function (event) {
  const regex = /^[A-Za-z\s]*$/; // Only allows letters and spaces
  const value = event.target.value;

  if (!regex.test(value)) {
    event.target.value = value.slice(0, -1);
    showMessage("Name can only contain letters and spaces.", "danger");
  }
});
