import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, elementStrings, renderLoader, clearLoader } from './views/base';

/**
 * Global State of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}

/**
 * Search Controller
 */

const controlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();

    // 2) Create a new search object and add it to state
    if (query) {
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultsParent);

        try {
            // 4) Search for recipes
            // Every async function returns a promise
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert(`Something wrong with the search: ${err}`);
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener('click', e => {
    const btn = e.target.closest(`.${elementStrings.resultsPageButton}`);
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.clearResultsButtons();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/**
 * Recipe Controller
 */

const controlRecipe = async () => {
    // GET ID from the URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight the selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            
            // Parse recipe ingredients
            state.recipe.parseIngredient();

            // Calcualte servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert(`Error processing recipe: ${err}`);
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handle recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('decrease');
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button clicked
        state.recipe.updateServings('increase');
    }
    recipeView.updateServingsIngredients(state.recipe);
});

window.l = new List();
