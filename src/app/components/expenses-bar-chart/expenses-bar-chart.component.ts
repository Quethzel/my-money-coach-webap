import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions, AgCharts } from 'ag-charts-community';
import { IExpenses } from 'src/app/models/interfaces/IExpenses';
import { CommonService } from 'src/app/services/common.service';

interface IChartExpensesByMonth {
  month: string;
  total: number;
}

@Component({
  selector: 'app-expenses-bar-chart',
  templateUrl: './expenses-bar-chart.component.html',
  styleUrls: ['./expenses-bar-chart.component.scss']
})
export class ExpensesBarChartComponent implements OnChanges {
  @Input() data: IExpenses[];
  public options: AgChartOptions;

  constructor(private commonService: CommonService) {
    this.data = [];


    this.options = {
        title: {
            text: "Expenses by Month",
        },
        subtitle: {
            text: 'Variable Expenses in MXN',
        },
        data: this.transformData(this.data),
        series: [
            {
                type: 'bar',
                xKey: 'month',
                yKey: 'total',
                yName: 'Total Expenses'
            }
        ],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options.data = this.transformData(this.data);

    this.options = { ...this.options };
  }
  


  private transformData(data: IExpenses[]) {
    const chartData: IChartExpensesByMonth[] = [];
    data.forEach((item) => {
      const month = item.date.getMonth();
      const monthName = this.commonService?.getMonthName(month); // Add null check
      const index = chartData.findIndex((x) => x.month === monthName);
      if (index > -1) {
        chartData[index].total += item.cost;
      } else {
        chartData.push({ month: monthName, total: item.cost });
      }
    });
    console.log(chartData);
    return chartData;
  }

}
