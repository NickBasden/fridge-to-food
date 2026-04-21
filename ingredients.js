const SUGGESTIONS = [
    'chicken', 'eggs', 'butter', 'garlic', 'onion', 'tomatoes',
    'pasta', 'rice', 'spinach', 'cheese', 'milk', 'potatoes',
    'carrots', 'broccoli', 'lemon', 'olive oil', 'bacon', 'salmon',
];

const ingredients = new Set();

const input = document.getElementById('ingredient-input');
const list  = document.getElementById('ingredient-list');
const empty = document.getElementById('empty-state');
const findBtn = document.getElementById('find-btn');
const suggestionsEl = document.getElementById('suggestions');

input.addEventListener('input', updateSuggestions);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addIngredient();
});

function updateSuggestions() {
    const query = input.value.trim().toLowerCase();
    suggestionsEl.innerHTML = '';

    if (!query) {
        suggestionsEl.classList.add('hidden');
        return;
    }

    const matches = SUGGESTIONS.filter(s =>
        s.startsWith(query) && !ingredients.has(s)
    ).slice(0, 5);

    if (matches.length === 0) {
        suggestionsEl.classList.add('hidden');
        return;
    }

    suggestionsEl.classList.remove('hidden');
    matches.forEach(match => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.textContent = match;
        chip.onclick = () => {
            input.value = match;
            addIngredient();
        };
        suggestionsEl.appendChild(chip);
    });
}

function addIngredient() {
    const value = input.value.trim().toLowerCase();
    if (!value || ingredients.has(value)) {
        input.value = '';
        suggestionsEl.classList.add('hidden');
        return;
    }

    ingredients.add(value);
    input.value = '';
    suggestionsEl.classList.add('hidden');
    renderList();
}

function removeIngredient(name) {
    ingredients.delete(name);
    renderList();
}

function renderList() {
    list.innerHTML = '';

    if (ingredients.size === 0) {
        empty.style.display = '';
        findBtn.disabled = true;
        return;
    }

    empty.style.display = 'none';
    findBtn.disabled = false;

    ingredients.forEach(name => {
        const li = document.createElement('li');
        li.className = 'ingredient-tag';
        li.innerHTML = `
            ${name}
            <button class="remove-btn" onclick="removeIngredient('${name}')" aria-label="Remove ${name}">✕</button>
        `;
        list.appendChild(li);
    });
}

function findRecipes() {
    const params = new URLSearchParams({ ingredients: [...ingredients].join(',') });
    window.location.href = `recipes.html?${params}`;
}
