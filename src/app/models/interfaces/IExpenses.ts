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
