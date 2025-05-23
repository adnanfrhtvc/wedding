let guests = {};
let guestNames = [];
let guestTables = [];

// Load guest data
fetch('guests.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load guest list.');
    return response.json();
  })
  .then(data => {
    guests = data;
    guestNames = Object.keys(guests);
    guestTables = Object.values(guests);
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

function showGuestsPerTbale() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "";

  if (Object.keys(guests).length === 0) {
    resultDiv.innerText = "Guest data not loaded yet.";
    return;
  }

  const tables = {};
  for (const [name, table] of Object.entries(guests)) {
    if (!tables[table]) tables[table] = [];
    tables[table].push(name);
  }

  for (const [tableName, guests] of Object.entries(tables)) {
    const tableGroup = document.createElement('div');
    tableGroup.className = 'table-group';

    const button = document.createElement('button');
    button.className = 'table-header';
    button.innerHTML = `${tableName} <span class="arrow">▶</span>`;
    
    const list = document.createElement('ul');
    list.className = 'guest-list';
    list.style.display = 'none';

    guests.forEach(guest => {
      const li = document.createElement('li');
      li.textContent = guest;
      list.appendChild(li);
    });

    // Add toggle functionality
    button.addEventListener('click', () => {
      list.style.display = list.style.display === 'none' ? 'block' : 'none';
      button.querySelector('.arrow').textContent = 
        list.style.display === 'none' ? '▶' : '▼';
    });

    tableGroup.appendChild(button);
    tableGroup.appendChild(list);
    resultDiv.appendChild(tableGroup);
  }
}