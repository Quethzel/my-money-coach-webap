//TODO: this is not used
export interface IExpenses {
    city: String;
    cityCode: String;
    item: String;
    category: String;
    subcategory: String;
    cost: Number;
    date: Date;
}

export interface IExpensesByCity {
    city: string;
    total: number;
}
