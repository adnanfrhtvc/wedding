let guests = {};
let guestNames = [];

// Load guest data
fetch('guests.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load guest list.');
    return response.json();
  })
  .then(data => {
    guests = data;
    guestNames = Object.keys(guests);
  })
  .catch(error => {
    document.getElementById('result').innerText = "Error loading guest data.";
    console.error(error);
  });

// Live suggestions as user types
document.getElementById('nameInput').addEventListener('input', function () {
  const input = this.value.toLowerCase();
  const suggestionsDiv = document.getElementById('suggestions');
  suggestionsDiv.innerHTML = "";

  if (input.length === 0) return;

  const matches = guestNames.filter(name => name.toLowerCase().includes(input));

  matches.forEach(name => {
    const div = document.createElement('div');
    const table = guests[name];
    div.textContent = `${name} – ${table}`;
    div.onclick = function () {
      document.getElementById('nameInput').value = name;
      suggestionsDiv.innerHTML = "";
      findTable();
    };
    suggestionsDiv.appendChild(div);
  });
});

function findTable() {
  const name = document.getElementById('nameInput').value.trim();
  const resultDiv = document.getElementById('result');
  const suggestionsDiv = document.getElementById('suggestions');
  suggestionsDiv.innerHTML = "";

  const table = guests[name];
  resultDiv.innerText = table ? `${name}, you're at ${table}!` : "Name not found.";
}
