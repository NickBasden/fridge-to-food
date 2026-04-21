const params = new URLSearchParams(window.location.search)
const ingredients = params.get('ingredients') || ''

async function loadRecipes() {
    renderIngredientChips()
    renderSkeletons()

    try {
        const response = await fetch(`${window.API_BASE}/recipes?ingredient=${encodeURIComponent(ingredients)}`)
        const recipes = await response.json()
        displayRecipes(recipes)
    } catch (err) {
        renderError()
    }
}

function renderIngredientChips() {
    const list = ingredients ? ingredients.split(',').filter(Boolean) : []
    const summary = document.getElementById('ingredient-summary')
    const chipsEl = document.getElementById('ingredient-chips')

    if (list.length === 0) {
        summary.textContent = 'No ingredients provided'
        return
    }

    summary.textContent = `Crafted from ${list.length} ingredient${list.length === 1 ? '' : 's'}`
    chipsEl.innerHTML = list
        .map(i => `<span class="ingredient-chip">${escapeHtml(i.trim())}</span>`)
        .join('')
}

function renderSkeletons() {
    const resultsDiv = document.getElementById('results')
    resultsDiv.innerHTML = Array.from({ length: 6 }).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-body">
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
            </div>
        </div>
    `).join('')
}

function renderError() {
    document.getElementById('results').innerHTML = `
        <div class="no-results">
            <span class="emoji">⚠️</span>
            <h3>Couldn't reach the kitchen</h3>
            <p>Make sure the backend is running and try again.</p>
            <a href="ingredients.html" class="back-btn">Back to ingredients</a>
        </div>
    `
}

function slugify(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function displayRecipes(recipes) {
    const resultsDiv = document.getElementById('results')
    const metaEl = document.getElementById('results-meta')
    resultsDiv.innerHTML = ''

    if (!Array.isArray(recipes) || recipes.length === 0) {
        metaEl.style.display = 'none'
        resultsDiv.innerHTML = `
            <div class="no-results">
                <span class="emoji">🍽️</span>
                <h3>No recipes found</h3>
                <p>Try adding a few more ingredients to expand your options.</p>
                <a href="ingredients.html" class="back-btn">← Edit ingredients</a>
            </div>
        `
        return
    }

    metaEl.style.display = 'flex'
    document.getElementById('results-count').innerHTML =
        `<span>${recipes.length}</span> recipe${recipes.length === 1 ? '' : 's'} ready to cook`

    recipes.forEach((recipe, idx) => {
        const usedCount = recipe.usedIngredients.length
        const missedCount = recipe.missedIngredients.length
        const isPerfect = missedCount === 0

        const used = recipe.usedIngredients
            .map(i => `<span class="tag used">${escapeHtml(i.name)}</span>`)
            .join('')
        const missed = recipe.missedIngredients
            .map(i => `<span class="tag missed">+ ${escapeHtml(i.name)}</span>`)
            .join('')

        const url = `https://spoonacular.com/recipes/${slugify(recipe.title)}-${recipe.id}`

        const badge = isPerfect
            ? `<div class="match-badge perfect">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Perfect match
                </div>`
            : `<div class="match-badge">${usedCount}/${usedCount + missedCount} in fridge</div>`

        const recipeEl = document.createElement('div')
        recipeEl.className = 'recipe-card'
        recipeEl.style.animationDelay = `${Math.min(idx * 60, 600)}ms`
        recipeEl.innerHTML = `
            <a href="${url}" target="_blank" rel="noopener" class="card-link">
                <div class="card-image">
                    ${badge}
                    <img src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3>${escapeHtml(recipe.title)}</h3>
                    <div class="ingredient-summary-row">
                        <div class="stat">
                            <span class="stat-value used">${usedCount}</span>
                            <span class="stat-label">You have</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value missed">${missedCount}</span>
                            <span class="stat-label">To buy</span>
                        </div>
                    </div>
                    <div class="tags">
                        ${used}
                        ${missed}
                    </div>
                    <span class="view-link">View recipe <span class="arrow">→</span></span>
                </div>
            </a>
        `
        resultsDiv.appendChild(recipeEl)
    })
}

loadRecipes()
