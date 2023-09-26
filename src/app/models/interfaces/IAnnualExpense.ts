export interface IAnnualExpense {
    item: string;
    category: string;
    subcategory?: string;
    paymentDate: Date;
    cost: number;
}