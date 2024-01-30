export interface IChartExpensesByMonth {
    month: string;
    total: number;
}

export interface IChartByMonthCategory {
    month: string;
    [key: string]: any;
}
