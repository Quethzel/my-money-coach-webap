export class ExpenseFilters {
    year!: number;
    month?: number;

    constructor() {
        this.byThisMonth();
    }

    byThisYear() {
        this.year = new Date().getFullYear();
        this.month = undefined;
        return this.getFilters();
    }

    byThisMonth() {
        this.byThisYear();
        this.month = new Date().getMonth();
        return this.getFilters();
    }


    getFilters() {
        return this;
    }

}