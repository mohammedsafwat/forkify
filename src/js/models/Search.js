import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = 'd9a3bd1edb430ce04702d9e1ba49167e';
        try {
            const result = await axios(`https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = result.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}