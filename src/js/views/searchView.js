import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { 
    elements.searchInput.value = ''; 
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
};

export const clearResultsButtons = () => {
    elements.searchResultsPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

var buttonType = {
    PREV: "prev",
    NEXT: "next"
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === buttonType.PREV ? page - 1 : page + 1}>
    <span>Page ${type === buttonType.PREV ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === buttonType.PREV ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numOfResults, resultsPerPage) => {
    const pages = Math.ceil(numOfResults / resultsPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only display a button to go to next page
        button = createButton(page, buttonType.NEXT);
    } else if (page === pages && pages > 1) {
        // Only display a button to go to previous page
        button = createButton(page, buttonType.PREV);
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, buttonType.PREV)}
            ${createButton(page, buttonType.NEXT)}
        `;
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, resultsPerPage);
};