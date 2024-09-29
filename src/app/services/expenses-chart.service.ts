import { Injectable } from '@angular/core';
import { IExpenses } from '../models/interfaces/IExpenses';
import { IChartByCategory, IChartByCity, IChartByDay, IChartByDayAndCategory, IChartByMonthCategory, IChartBySubcategory, IChartExpensesByMonth } from '../models/interfaces/IChart';
import { AgChartOptions } from 'ag-charts-community';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesChartService {

  constructor(private commonService: CommonService) { }

  byCategory(data: IExpenses[], options: AgChartOptions, topCategories?: number) {
    const dataChart = this.transformDataByCategory(data);
    options.data = dataChart;
    if (topCategories) {
      options.data = options.data.sort((a, b) => b.total - a.total).slice(0, topCategories);
    } else {
      options.data = options.data;
    }
    return this.buildCategorySeries(options);
  }

  byCity(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByCity(data);
    options.data = dataChart;
    return options;
  }

  byDayAndCategory(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByDayAndCategory(data);
    options.data = dataChart;
    return options;
  }

  byDay(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByDay(data);
    options.data = this.sortByDayOfWeek(dataChart);
    return options;

  }

  bySubcategories(data: IExpenses[], options: AgChartOptions, topSubcategories?: number) {
    const dataChart = this.transformDataBySubcategory(data);
    const subcategoriesTotalCount = dataChart.length;
    if (topSubcategories) {
      options.data = dataChart.sort((a, b) => b.total - a.total).slice(0, topSubcategories);
    } else {
      options.data = dataChart;
    }
    return this.buildSubcategorySeries(options, subcategoriesTotalCount);
  }

  byYear(data: IExpenses[], options: AgChartOptions) {
    const dataChart = this.transformDataByTotalByMonth(data);
    options.data = this.sortByMonth(dataChart);
    return options;
  }

  
  private transformDataByDay(data: IExpenses[]) {
    const dataChart: IChartByDay[] = [];
    data.forEach((item) => {
      const day = item.date.getDay();
      const dayName = this.commonService.getDaysOfTheWeek()[day];
      const index = dataChart.findIndex((x) => x.Day === dayName);
      if (index > -1) {
        dataChart[index].Total += item.cost;
      } else {
        dataChart.push({ Day: dayName, Total: item.cost });
      }
    });

    return dataChart;
  }

  private transformDataByDayAndCategory(data: IExpenses[]) {
    const dataChart: IChartByDayAndCategory[] = [];

    data.forEach((item) => {
      const day = item.date.getDay();
      const dayName = this.commonService.getDaysOfTheWeek()[day];

      const index = dataChart.findIndex((x) => x.Category === item.category && x.Day === dayName);
      if (index > -1) {
        dataChart[index].Total += item.cost;
      } else {
        dataChart.push({ Day: dayName, Category: item.category, Total: item.cost });
      }
    });

    return dataChart;
  }

  private transformDataByCity(data: IExpenses[]) {
    const dataChart: IChartByCity[] = [];

    data.forEach((item) => {
      const city = item.cityCode ? item.cityCode : 'Unknown City';
      const index = dataChart.findIndex((x) => x.City === city);
      if (index > -1) {
        dataChart[index].Total += item.cost;
      } else {
        dataChart.push({ City: city, Total: item.cost });
      }
    });

    return dataChart;
  }

  private transformDataByCategory(data: IExpenses[]) {
    const dataChart: IChartByCategory[] = [];

    data.forEach((item) => {
      const category = item.category;
      const index = dataChart.findIndex((x) => x.category === category);
      index === -1
        ? dataChart.push({ category: item.category, total: item.cost })
        : (dataChart[index].total += item.cost);
    });

    return dataChart;
  }

  //TODO: refactor this method
  prepareStackedBarChartData(expenses: IExpenses[], options: AgChartOptions) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const categorySet = new Set<string>();
    const dataByMonthAndCategory: { [key: string]: { [key: string]: number } } = {};

    // Organizar los datos
    expenses.forEach(expense => {
      const month = months[expense.date.getMonth()];
      const category = expense.category;
      categorySet.add(category);

      if (!dataByMonthAndCategory[month]) {
        dataByMonthAndCategory[month] = {};
      }

      if (!dataByMonthAndCategory[month][category]) {
        dataByMonthAndCategory[month][category] = 0;
      }

      dataByMonthAndCategory[month][category] += expense.cost;
    });

    // Convertir los datos en el formato adecuado para Chart.js
    const datasets = Array.from(categorySet).map(category => ({
      label: category,
      data: months.map(month => dataByMonthAndCategory[month]?.[category] || 0),
    }));

    const result = {
      labels: months,
      datasets: datasets
    };

    const dataChart = result.datasets;
    options.data = dataChart;

    return options;
  }

  //TODO: refactor this method
  dataByCategoryByMonth(data: IExpenses[], options: AgChartOptions) {
    const chartData: IChartByMonthCategory[] = [];

    data.forEach((item) => {
      const month = item.date.getMonth();
      const monthName = this.commonService.getMonthName(month);
      const category = item.category;
      const index = chartData.findIndex((x) => x.month === month);
      if (index > -1) {
        const categoryIndex = Object.keys(chartData[index]).findIndex((x) => x === category);
        if (categoryIndex > -1) {
          chartData[index][category] += item.cost;
        } else {
          chartData[index][category] = item.cost;
        }
      } else {
        chartData.push({ monthName, month, [item.category]: item.cost });
      }
    });

    if (data.length > 0) console.log(chartData);

    if (data.length > 0) {
      const categories = Object.keys(chartData[0]).filter((x) => x !== 'month');
      options.series = this.buildCategoryByMonthSeries(categories);

      chartData.forEach((item) => {
        categories.forEach((category) => {
          item[category] = item[category] || 0;
        });
      });
    }

    options.data = this.sortByMonth(chartData);
    return options;

  }

  //TODO: refactor this method
  private buildCategoryByMonthSeries(categories: string[]) {
    const series: any[] = [];
    categories.forEach((category) => {
      series.push({
        type: 'bar',
        xKey: 'monthName',
        yKey: category,
        yName: category,
        stacked: true,
        // normalizedTo: 100,
      });
    });

    return series;
  }

  private transformDataByTotalByMonth(data: IExpenses[]) {
    const dataChart: IChartExpensesByMonth[] = [];

    data.forEach((item) => {
      const month = item.date.getMonth();
      const monthName = this.commonService.getMonthName(month);
      const index = dataChart.findIndex((x) => x.month === month);
      index === -1
        ? dataChart.push({ month: month, monthName, total: item.cost })
        : (dataChart[index].total += item.cost);
    });

    return dataChart;
  }

  private transformDataBySubcategory(data: IExpenses[]) {
    const dataChart: IChartBySubcategory[] = [];

    data.forEach((item) => {
      const subcategory = item.subcategory;
      const index = dataChart.findIndex((x) => x.subcategory === subcategory);
      index === -1
        ? dataChart.push({ category: item.category, subcategory: item.subcategory, total: item.cost })
        : (dataChart[index].total += item.cost);
    });

    return dataChart;
  }

  private buildCategorySeries(options: AgChartOptions) {
    if (options.data.length > 0) {
      options.data = options.data.sort((a, b) => b.total - a.total);
      options.series.forEach((item) => {
        item.tooltip = {
          renderer: (params: any) => {
            return {
              title: params.datum?.category,
              content: params.datum?.total != null
                ? `${this.commonService.capitalize(params.yKey)} : ${CommonService.formatAsCurrency(params.datum.total)}`
                : `${this.commonService.capitalize(params.yKey)}: 0`
            };
          }
        }
      });

      if (options.title == null) {
        options.title = { text: `Expenses by Category (${options.data.length})` };
      }
      if (options.subtitle == null) {
        options.subtitle = { text: 'Variable Expenses in MXN' };
      }

    }
    return options;
  }

  private buildSubcategorySeries(options: AgChartOptions, subcategoriesTotalCount: number) {
    if (options.data.length > 0) {
      options.data = options.data.sort((a, b) => b.total - a.total);
      options.series.forEach((item) => {
        item.tooltip = {
          renderer: (params: any) => {
            return {
              title: params.datum?.subcategory,
              content: params.datum?.total != null
                ? `${this.commonService.capitalize(params.yKey)} : ${CommonService.formatAsCurrency(params.datum.total)}`
                : `${this.commonService.capitalize(params.yKey)}: 0`
            };
          }
        }
      });

      if (options.title == null) {
        const count = subcategoriesTotalCount > options.data.length 
          ? `${options.data.length} of ${subcategoriesTotalCount}` 
          : options.data.length;
        options.title = { text: `Expenses by Subcategory (${count})` };
      }
      if (options.subtitle == null) {
        options.subtitle = { text: 'Variable Expenses in MXN' };
      }

    }
    return options;
  }

  private sortByDayOfWeek(data: IChartByDay[]) {
    const days = this.commonService.getDaysOfTheWeek();

    const sortedData = data.sort((a, b) => {
      return days.indexOf(a.Day) - days.indexOf(b.Day);
    });

    return sortedData;
  }

  private sortByMonth(data: IChartExpensesByMonth[] | IChartByMonthCategory[]) {
    return data.sort((a, b) => a.month - b.month);
  }


}
