let allUsers = [];

const loadButton = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusEl = document.getElementById('status');
const usersListEl = document.getElementById('users-list');

loadButton.addEventListener('click', loadUsers);
filterInput.addEventListener('input', handleFilter);

async function loadUsers() {
    loadButton.disabled = true;
    statusEl.textContent = 'Loading users...';
    usersListEl.innerHTML = '';

    try {
        // To test the error path, temporarily change the URL below (e.g., add a typo)
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        allUsers = await response.json();
        statusEl.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
    } catch (error) {
        statusEl.textContent = `Failed to load users: ${error.message}`;
    } finally {
        loadButton.disabled = false;
    }
}

function renderUsers(users) {
    usersListEl.innerHTML = '';

    if (users.length === 0) {
        statusEl.textContent = 'No users match your filter.';
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');

        const nameEl = document.createElement('strong');
        nameEl.textContent = user.name;

        const infoEl = document.createElement('p');
        infoEl.textContent = `Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

        li.appendChild(nameEl);
        li.appendChild(infoEl);
        usersListEl.appendChild(li);
    });
}

function handleFilter() {
    const query = filterInput.value.toLowerCase().trim();
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query)
    );

    if (filteredUsers.length > 0 && allUsers.length > 0) {
        statusEl.textContent = `Showing ${filteredUsers.length} of ${allUsers.length} users.`;
    }

    renderUsers(filteredUsers);
}