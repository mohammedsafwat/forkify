import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';

import { elements, elementStrings, renderLoader, clearLoader } from './views/base';

/**
 * Global State of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}
window.state = state;

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

/**
 * Shopping List Controller
 */
const controlShoppingList = () => {
    // Create a new list of there is none yet
    if (!state.shoppingList) state.shoppingList = new ShoppingList();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.shoppingList.addItem(el.count, el.unit, el.ingredient);
        shoppingListView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.shoppingList.deleteItem(id);

        // Delete from UI
        shoppingListView.deleteItem(id);
    // Handle the count event
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.shoppingList.updateCount(id, val);
    }
});

// Handle recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('decrease');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button clicked
        state.recipe.updateServings('increase');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        controlShoppingList();
    }
});