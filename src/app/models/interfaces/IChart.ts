export interface IChartExpensesByMonth {
    month: string;
    total: number;
}

export interface IChartByMonthCategory {
    month: string;
    [key: string]: any;
}

export interface IChartByCategory {
    category: string;
    total: number;
}

export interface IChartByCity {
    City: string;
    Total: number;
}

export interface IChartByDayAndCategory {
    Day: string;
    Category: string;
    Total: number;
}

export interface IChartByDay {
    Day: string;
    Total: number;
}
