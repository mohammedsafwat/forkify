import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

        // 4) Search for recipes
        // Every async function returns a promise
        await state.search.getResults();

        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
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

const r = new Recipe(46956);
r.getRecipe();
console.log(r);