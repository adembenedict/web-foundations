let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word)
function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(lowerWord));
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;
  
  let longest = notes[0];
  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// 3. countByCategory()
function countByCategory() {
  const counts = {};
  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

// 4. getSummary()
function getSummary() {
  const count = notes.length;
  const noteWord = count === 1 ? "note" : "notes";
  const categoryCounts = countByCategory();
  
  const categoryStrings = [];
  for (let category in categoryCounts) {
    categoryStrings.push(`${categoryCounts[category]} ${category}`);
  }
  
  return `${count} ${noteWord}: ${categoryStrings.join(', ')}.`;
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  const cleanText = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === cleanText);
}

// 6. addNote(text, category)
function addNote(text, category) {
  const cleanText = text.trim();
  const validCategories = ["personal", "work", "study"];

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log("Failed to add: Text must be between 1 and 200 characters.");
    return false;
  }
  
  if (isDuplicate(cleanText)) {
    console.log("Failed to add: Note is a duplicate.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Failed to add: Invalid category.");
    return false;
  }

  // Create a new ID by finding the highest current ID and adding 1
  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  
  notes.push({ id: newId, text: cleanText, category: category });
  return true;
}


// --- TESTS ---
console.log("--- Testing searchNotes ---");
console.log(searchNotes("day")); 
console.log(searchNotes("xylophone")); 

console.log("\n--- Testing longestNote ---");
console.log(longestNote()); 
let tempNotes = notes; 
notes = [];
console.log(longestNote()); 
notes = tempNotes;

console.log("\n--- Testing countByCategory ---");
console.log(countByCategory());
notes = []; 
console.log(countByCategory()); 
notes = tempNotes; 

console.log("\n--- Testing getSummary ---");
console.log(getSummary()); 
notes = [{ id: 1, text: "Test note", category: "personal" }];
console.log(getSummary());
notes = tempNotes; 

console.log("\n--- Testing isDuplicate ---");
console.log(isDuplicate("  CALL mum  ")); 
console.log(isDuplicate("Walk the dog")); 

console.log("\n--- Testing addNote ---");
console.log(addNote("Walk the dog", "personal")); 
console.log(addNote("", "study"));
console.log(addNote("Call mum", "personal")); 
console.log(addNote("Do groceries", "home")); 

console.log("\nFinal Notes Array:");
console.log(notes); 