//TODO: this is not used
export interface IExpenses {
    id: string;
    city: string | null;
    cityCode: string | null;
    item: string;
    category: string;
    subcategory: string | null;
    cost: number;
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
