import { ChartConfiguration } from 'chart.js';

export interface IDataset<T> {
    data: T[];
    label: string;
}

export class DataChart<T> {
    labels: string[];
    datasets: IDataset<T>[];
    constructor(labels: string[], datasets: IDataset<T>[]) {
        this.labels = labels;
        this.datasets = datasets;
    }
}

export class CustomDataChart<T> {
    data!: DataChart<T>;
    options: ChartConfiguration['options'] = {
        responsive: true
    };

    constructor(labels: string[], datasets: IDataset<T>[]) {
        this.data = new DataChart<T>(labels, datasets);
    };
}