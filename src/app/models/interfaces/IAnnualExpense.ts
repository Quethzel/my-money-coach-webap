export interface IAnnualExpense {
    id: string;
    item: string;
    category: string;
    subcategory?: string;
    paymentDate: Date;
    cost: number;
}