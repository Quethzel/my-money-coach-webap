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

export interface IExpensesByMonth {
    month: number,
    total: number
}

export interface IExpensesByCity {
    city: string;
    total: number;
}


export interface IExpensesByCategory {
 category: string;
 total: number;   
}

export interface IExpensesBySubcategory {
    subcategory: string;
    total: number;
}
