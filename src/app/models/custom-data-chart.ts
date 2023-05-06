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

export class ChartConfig {
    options: ChartConfiguration['options'];

      constructor(indexAxis?: 'x' | 'y') {
        this.options = {
            responsive: true,
            plugins: { 
              legend: { display: false }
            }
        };
        
        if (indexAxis) { this.options.indexAxis = indexAxis }
      }

      get () {
        return this.options;
      }
}

export class CustomDataChart<T> {
    data!: DataChart<T>;
    options: ChartConfiguration['options'] = {
        responsive: true,
    };

    constructor(labels: string[], datasets: IDataset<T>[], options?: ChartConfig) {
        this.data = new DataChart<T>(labels, datasets);

        if (options) {
            this.options = options.get();
        }
    };
}
