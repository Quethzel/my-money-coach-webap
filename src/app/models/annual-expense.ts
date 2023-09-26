export class AnnualExpense {
    id: string;
    item: string;
    category: string;
    subcategory?: string;
    paymentDate: Date;
    cost: number;

    constructor() {
        this.id = null;
        this.item = null;
        this.category = null;
        this.subcategory = null;
        this.paymentDate = new Date();
        this.cost = 0;
    }
}