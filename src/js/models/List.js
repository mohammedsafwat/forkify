import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // We start at the position of elemtn with the id we need
        // to delete and then we take one item
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount
    }
}