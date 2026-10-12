const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// Update counts and warning classes
function updateCounts() {
  const text = noteText.value;
  const length = text.length;

  // Calculate word count (splitting by whitespace)
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // Update text content
  charCount.textContent = `${length} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Reset counter classes
  charCount.classList.remove("warning", "over");

  // Apply warning or over styles
  if (length > 200) {
    charCount.classList.add("over");
  } else if (length > 180) {
    charCount.classList.add("warning");
  }
}

// Clear note function
function clearNote() {
  noteText.value = "";
  localStorage.removeItem("note_draft");
  updateCounts();
}

// Initialize application state on page load
function init() {
  // Restore saved draft
  const savedDraft = localStorage.getItem("note_draft");
  if (savedDraft !== null) {
    noteText.value = savedDraft;
  }

  // Restore saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light mode";
  } else {
    themeToggle.textContent = "Dark mode";
  }

  updateCounts();
}

// Event Listeners
noteText.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("note_draft", noteText.value);
});

clearBtn.addEventListener("click", clearNote);

// Clear on pressing Escape inside textarea
noteText.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    clearNote();
  }
});

// Toggle theme button
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem("theme", "light");
  }
});

// Run initialization
init();